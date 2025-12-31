/**
 * Case Studies Detail Renderer
 * Composes generic sections to create case study detail page
 * Makes it easy to reuse sections for other portfolio items
 */

import React from 'react';
import { CaseStudy } from '@/lib/data/caseStudies';
import {
  DetailHeader,
  ResultsGrid,
  AchievementsList,
  TechStackDisplay,
  ChallengeSolution,
} from '@/components/sections';

interface CaseStudyDetailRendererProps {
  caseStudy: CaseStudy;
  onScrollToSection?: (sectionId: string) => void;
}

export function renderCaseStudyDetail({ caseStudy, onScrollToSection }: CaseStudyDetailRendererProps) {
  // Prepare header details
  const headerDetails = [
    ...(caseStudy.client ? [{ label: 'Client', value: caseStudy.client }] : []),
    ...(caseStudy.duration ? [{ label: 'Duration', value: caseStudy.duration }] : []),
    ...(caseStudy.location ? [{ label: 'Location', value: caseStudy.location }] : []),
    ...(caseStudy.role ? [{ label: 'Role', value: caseStudy.role }] : []),
  ];

  // Prepare header images
  const headerImages = [caseStudy.image].filter((img) => img);

  // Prepare header links
  const headerLinks = {
    ...(caseStudy.liveUrl && { live: caseStudy.liveUrl }),
    ...(caseStudy.githubUrl && { github: caseStudy.githubUrl }),
  };

  // Get results
  const results = caseStudy.results || [];

  // Get achievements
  const achievements = caseStudy.keyAchievements || caseStudy.achievements || [];

  // Get technologies
  const technologies = caseStudy.techStack || caseStudy.technologies || [];

  return {
    // Render header
    header: (
      <DetailHeader
        title={caseStudy.title}
        subtitle={caseStudy.subtitle}
        description={caseStudy.longDescription || caseStudy.description}
        images={headerImages}
        details={headerDetails}
        links={headerLinks}
        actionLabel="View Details"
        onAction={() => onScrollToSection?.('challenge')}
      />
    ),

    // Render challenge/solution
    challengeSolution: caseStudy.challenge &&
      caseStudy.solution && (
        <ChallengeSolution
          challenge={{
            id: 'challenge',
            title: 'Challenge',
            content: caseStudy.challenge,
          }}
          solution={{
            id: 'solution',
            title: 'Solution',
            content: caseStudy.solution,
          }}
        />
      ),

    // Render results
    results:
      results.length > 0 && (
        <ResultsGrid
          title="Key Results"
          items={results}
          layout={results.length <= 2 ? 'grid-2' : results.length <= 3 ? 'grid-3' : 'grid-4'}
        />
      ),

    // Render achievements
    achievements:
      achievements.length > 0 && (
        <AchievementsList title="Key Achievements" items={achievements} />
      ),

    // Render tech stack
    techStack:
      technologies.length > 0 && (
        <TechStackDisplay title="Technologies Used" technologies={technologies} />
      ),
  };
}

/**
 * Alternative: Render all sections at once
 */
export function CaseStudyDetailSections({ caseStudy, onScrollToSection }: CaseStudyDetailRendererProps) {
  const rendered = renderCaseStudyDetail({ caseStudy, onScrollToSection });

  return (
    <>
      {rendered.header}
      {rendered.challengeSolution}
      {rendered.results}
      {rendered.achievements}
      {rendered.techStack}
    </>
  );
}
