'use client';

import { memo, useMemo, useState } from 'react';
import Image from 'next/image';
import { getImage } from '@/lib/api/apiClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

function ImageCarouselInner({ images, title }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  // Resolve all image URLs once — not on every render
  const imageUrls = useMemo(() => images.map((img) => getImage(img)), [images]);

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full rounded-lg shadow-lg overflow-hidden bg-slate-100">
        <img
          src={imageUrls[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="w-full h-auto"
        />

        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-slate-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-slate-900" />
            </button>
            <div className="absolute bottom-4 right-4 bg-slate-900/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex gap-3 mt-4 justify-center">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-12 h-12 rounded border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-blue-600 ring-2 ring-blue-300'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <Image src={url} alt={`Thumbnail ${index + 1}`} width={48} height={48} className="w-full h-full object-cover rounded-sm" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const ImageCarousel = memo(ImageCarouselInner);
