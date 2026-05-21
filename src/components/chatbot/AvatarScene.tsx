"use client";

import { Suspense, useEffect, useRef, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AvatarWidget } from "./AvatarWidget";
import type { AvatarEmotion } from "./types";

// ─── Error boundary — falls back to photo avatar if GLB missing / fails ───────

interface EBState {
  hasError: boolean;
}
interface EBProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

class AvatarErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError(): EBState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, _: ErrorInfo) {
    this.props.onError?.();
    if (process.env.NODE_ENV !== "production") {
      console.warn("[AvatarScene] Falling back:", error.message);
    }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// ─── Procedural animation config per emotion ──────────────────────────────────

interface AnimConfig {
  // Body bob: amplitude (m) and speed (rad/s)
  bobAmp: number;
  bobSpeed: number;
  // Head rotation: target angles
  headTiltX: number; // nod (up/down)
  headTiltZ: number; // tilt side
  headSwayAmp: number; // left/right sway amplitude
  headSwaySpeed: number;
  // Root position offset
  rootBounce: number;
  rootBounceSpeed: number;
}

const ANIM: Record<AvatarEmotion, AnimConfig> = {
  idle: {
    bobAmp: 0.004,
    bobSpeed: 1.2,
    headTiltX: 0,
    headTiltZ: 0,
    headSwayAmp: 0.015,
    headSwaySpeed: 0.6,
    rootBounce: 0,
    rootBounceSpeed: 0,
  },
  thinking: {
    bobAmp: 0.003,
    bobSpeed: 0.8,
    headTiltX: 0.05,
    headTiltZ: 0.18,
    headSwayAmp: 0.008,
    headSwaySpeed: 0.4,
    rootBounce: 0,
    rootBounceSpeed: 0,
  },
  talking: {
    bobAmp: 0.01,
    bobSpeed: 3.5,
    headTiltX: 0,
    headTiltZ: 0,
    headSwayAmp: 0.03,
    headSwaySpeed: 2.8,
    rootBounce: 0.004,
    rootBounceSpeed: 3.5,
  },
  happy: {
    bobAmp: 0.025,
    bobSpeed: 5.0,
    headTiltX: -0.08,
    headTiltZ: 0,
    headSwayAmp: 0.04,
    headSwaySpeed: 5.0,
    rootBounce: 0.018,
    rootBounceSpeed: 5.0,
  },
  alert: {
    bobAmp: 0.005,
    bobSpeed: 1.0,
    headTiltX: 0,
    headTiltZ: 0,
    headSwayAmp: 0.06,
    headSwaySpeed: 8.0, // fast shake = "no"
    rootBounce: 0,
    rootBounceSpeed: 0,
  },
};

// Common bone name candidates for Avaturn / RPM skeletons
const HEAD_BONES = ["Head", "head", "mixamorigHead"];
const SPINE_BONES = ["Spine", "Spine1", "spine", "mixamorigSpine"];

function findBone(
  root: THREE.Object3D,
  candidates: string[],
): THREE.Object3D | null {
  for (const name of candidates) {
    const bone = root.getObjectByName(name);
    if (bone) return bone;
  }
  return null;
}

// ─── Animated avatar mesh ─────────────────────────────────────────────────────

interface RPMAvatarProps {
  emotion: AvatarEmotion;
  isSpeaking: boolean;
}

function RPMAvatar({ emotion, isSpeaking }: RPMAvatarProps) {
  const { scene } = useGLTF("/avatar/avatar.glb");

  // Fix materials + set natural rest pose on mount
  useEffect(() => {
    scene.traverse((obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        const name = (mat.name ?? "").toLowerCase();
        const keepAlpha =
          name.includes("hair") ||
          name.includes("glass") ||
          name.includes("eye");
        if (!keepAlpha) {
          mat.transparent = false;
          mat.opacity = 1;
          mat.alphaTest = 0;
          mat.side = THREE.FrontSide;
        }
        mat.depthWrite = true;
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  const rootRef = useRef<THREE.Group>(null);
  const clockRef = useRef(0);
  const configRef = useRef<AnimConfig>(ANIM.idle);
  const targetRef = useRef<AnimConfig>(ANIM.idle);
  const restPoseSet = useRef(false);

  // Smoothly lerp config when emotion changes
  useEffect(() => {
    targetRef.current =
      ANIM[isSpeaking && emotion === "idle" ? "talking" : emotion];
  }, [emotion, isSpeaking]);

  useFrame((_, delta) => {
    if (!rootRef.current) return;

    // Apply arm rest pose once — via SkinnedMesh skeleton (authoritative bone list)
    if (!restPoseSet.current) {
      // X-axis rotation confirmed via gltf.report — both arms same positive value
      const REST: Record<string, number> = {
        LeftArm:  75 * (Math.PI / 180),
        RightArm: 75 * (Math.PI / 180),
      };
      let hits = 0;
      rootRef.current.traverse((obj) => {
        const sm = obj as THREE.SkinnedMesh;
        if (!sm.isSkinnedMesh) return;
        sm.skeleton.bones.forEach((bone) => {
          if (bone.name in REST) {
            bone.matrixAutoUpdate = true;
            bone.rotation.x = REST[bone.name];
            bone.updateMatrix();
            hits++;
          }
        });
      });
      if (hits > 0) restPoseSet.current = true;
    }

    clockRef.current += delta;
    const t = clockRef.current;

    // Lerp toward target config (smooth transition ~0.8s)
    const lerpSpeed = delta * 1.8;
    const cfg = configRef.current;
    const tgt = targetRef.current;
    cfg.bobAmp += (tgt.bobAmp - cfg.bobAmp) * lerpSpeed;
    cfg.bobSpeed += (tgt.bobSpeed - cfg.bobSpeed) * lerpSpeed;
    cfg.headTiltX += (tgt.headTiltX - cfg.headTiltX) * lerpSpeed;
    cfg.headTiltZ += (tgt.headTiltZ - cfg.headTiltZ) * lerpSpeed;
    cfg.headSwayAmp += (tgt.headSwayAmp - cfg.headSwayAmp) * lerpSpeed;
    cfg.headSwaySpeed += (tgt.headSwaySpeed - cfg.headSwaySpeed) * lerpSpeed;
    cfg.rootBounce += (tgt.rootBounce - cfg.rootBounce) * lerpSpeed;
    cfg.rootBounceSpeed +=
      (tgt.rootBounceSpeed - cfg.rootBounceSpeed) * lerpSpeed;

    // Root body bob (breathing / bounce)
    const bodyBob = Math.sin(t * cfg.bobSpeed) * cfg.bobAmp;
    const rootY =
      -1.2 +
      bodyBob +
      Math.abs(Math.sin(t * cfg.rootBounceSpeed)) * cfg.rootBounce;
    rootRef.current.position.y = rootY;

    // Head: tilt + sway
    const head = findBone(rootRef.current, HEAD_BONES);
    if (head) {
      head.rotation.x = THREE.MathUtils.lerp(
        head.rotation.x,
        cfg.headTiltX + Math.sin(t * cfg.bobSpeed * 0.5) * 0.01,
        lerpSpeed * 2,
      );
      head.rotation.z = THREE.MathUtils.lerp(
        head.rotation.z,
        cfg.headTiltZ + Math.sin(t * cfg.headSwaySpeed) * cfg.headSwayAmp,
        lerpSpeed * 2,
      );
    }

    // Spine: subtle counter-sway for natural feel
    const spine = findBone(rootRef.current, SPINE_BONES);
    if (spine) {
      spine.rotation.z = THREE.MathUtils.lerp(
        spine.rotation.z,
        Math.sin(t * cfg.headSwaySpeed * 0.5) * cfg.headSwayAmp * 0.3,
        lerpSpeed,
      );
    }
  });

  return (
    <group ref={rootRef} position={[0, -1.2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/avatar/avatar.glb");

// ─── Public scene component ───────────────────────────────────────────────────

interface AvatarSceneProps {
  emotion: AvatarEmotion;
  isSpeaking: boolean;
  /** compact=true → small full-body bubble (80×170px). false → wide chest-up header */
  compact?: boolean;
  onError?: () => void;
}

export default function AvatarScene({ emotion, isSpeaking, compact = false, onError }: AvatarSceneProps) {
  const photoFallback = compact ? null : (
    <div className="w-full flex items-center justify-center" style={{ height: 220 }}>
      <AvatarWidget emotion={emotion} size="full" isSpeaking={isSpeaking} />
    </div>
  );

  const camPos  = compact ? [0, 0.1, 2.2] as [number, number, number] : [0, 0.55, 2.2] as [number, number, number];
  const camFov  = compact ? 45 : 38;
  const canvasStyle = compact
    ? { width: '80px', height: '170px' }
    : { width: '100%', height: '240px' };

  return (
    <AvatarErrorBoundary fallback={photoFallback} onError={onError}>
      <Canvas
        camera={{ position: camPos, fov: camFov }}
        style={canvasStyle}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 2, 4]} intensity={1.5} />
        <directionalLight position={[2, 3, 2]}  intensity={0.6} />
        <directionalLight position={[-2, 3, 2]} intensity={0.6} />
        <Suspense fallback={null}>
          <RPMAvatar emotion={emotion} isSpeaking={isSpeaking} />
        </Suspense>
      </Canvas>
    </AvatarErrorBoundary>
  );
}
