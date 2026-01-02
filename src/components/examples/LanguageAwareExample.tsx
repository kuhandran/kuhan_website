/**
 * EXAMPLE: Language-Aware Component
 * 
 * This example demonstrates how to use the new language system
 * in your components. Copy and adapt this pattern for your own needs.
 * 
 * File: src/components/examples/LanguageAwareExample.tsx
 */

'use client';

import { useLanguage, useLanguageContent } from '@/lib/hooks';
import { useState, useEffect } from 'react';

/**
 * Example 1: Basic Language Switcher with Content Loading
 */
export function LanguageSwitcherExample() {
  const { language, languages, changeLanguage, isLoading: langLoading } =
    useLanguage();
  const { getData, getConfig, isLoading, error } = useLanguageContent({
    dataTypes: ['contentLabels', 'projects'],
    configTypes: ['pageLayout'],
  });

  const contentLabels = getData('contentLabels');
  const projects = getData('projects');
  const pageLayout = getConfig('pageLayout');

  return (
    <div className="language-switcher-example">
      {/* Language Selection Dropdown */}
      <div className="language-selector">
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          disabled={langLoading}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName} ({lang.code})
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {isLoading && <div className="loading">Loading content...</div>}

      {/* Error State */}
      {error && <div className="error">Error: {error}</div>}

      {/* Content Display */}
      {!isLoading && !error && (
        <div className="content">
          {/* Page Header */}
          <h1>{pageLayout?.title || 'Portfolio'}</h1>

          {/* Content Labels */}
          <div className="labels">
            <p>
              <strong>Greeting:</strong> {contentLabels?.greeting}
            </p>
            <p>
              <strong>Description:</strong> {contentLabels?.description}
            </p>
          </div>

          {/* Projects List */}
          <section className="projects">
            <h2>{contentLabels?.projectsTitle || 'Projects'}</h2>
            {projects && projects.length > 0 ? (
              <ul>
                {projects.map((project: any) => (
                  <li key={project.id}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a href={project.link}>{contentLabels?.viewProject}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects available for this language.</p>
            )}
          </section>

          {/* Language Info */}
          <div className="language-info">
            <p>
              Current Language: <strong>{language}</strong>
            </p>
            <p>
              Total Languages: <strong>{languages.length}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Config-Only Loading (Page Layout)
 */
export function PageLayoutExample() {
  const { language } = useLanguage();
  const { getConfig, isLoading } = useLanguageContent({
    configTypes: ['pageLayout'],
  });

  const layout = getConfig('pageLayout');

  if (isLoading) return <div>Loading layout...</div>;

  return (
    <div className="page-layout">
      <header>
        <h1>{layout?.header?.title}</h1>
        <p>{layout?.header?.subtitle}</p>
      </header>

      <main>
        <section>
          <h2>{layout?.sections?.about?.title}</h2>
          <p>{layout?.sections?.about?.content}</p>
        </section>

        <section>
          <h2>{layout?.sections?.projects?.title}</h2>
          {/* Content here */}
        </section>
      </main>

      <footer>
        <p>{layout?.footer?.copyright}</p>
        <p>Language: {language}</p>
      </footer>
    </div>
  );
}

/**
 * Example 3: Data-Only Loading (No Config)
 */
export function PortfolioDataExample() {
  const { language } = useLanguage();
  const { getData, loadData, isLoading, error } = useLanguageContent({
    dataTypes: ['projects', 'skills', 'experience', 'education'],
  });

  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const projects = getData('projects');
  const skills = getData('skills');
  const experience = getData('experience');
  const education = getData('education');

  if (isLoading) return <div>Loading portfolio data...</div>;
  if (error) return <div>Error loading content: {error}</div>;

  return (
    <div className="portfolio">
      <h1>Portfolio ({language})</h1>

      {/* Projects */}
      <section>
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects?.map((project: any) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {expandedProject === project.id && (
                <div className="project-details">
                  <p>Technologies: {project.technologies?.join(', ')}</p>
                  <a href={project.link}>View Project</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2>Skills</h2>
        <div className="skills-container">
          {skills?.map((skill: any) => (
            <div key={skill.name} className="skill-item">
              <h4>{skill.name}</h4>
              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{ width: `${skill.level || 80}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2>Experience</h2>
        <div className="timeline">
          {experience?.map((exp: any) => (
            <div key={exp.id} className="timeline-item">
              <h3>{exp.position}</h3>
              <p>{exp.company}</p>
              <p className="date">
                {exp.startDate} - {exp.endDate || 'Present'}
              </p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2>Education</h2>
        {education?.map((edu: any) => (
          <div key={edu.id} className="education-item">
            <h3>{edu.degree}</h3>
            <p>{edu.school}</p>
            <p>{edu.year}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

/**
 * Example 4: On-Demand Content Loading
 */
export function LazyLoadingExample() {
  const { language, changeLanguage, languages } = useLanguage();
  const { loadData, getData, isLoading } = useLanguageContent();

  const [achievements, setAchievements] = useState<any>(null);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  const handleLoadAchievements = async () => {
    setLoadingAchievements(true);
    const data = await loadData('achievements');
    setAchievements(data);
    setLoadingAchievements(false);
  };

  return (
    <div className="lazy-loading-example">
      <h1>Lazy Loading Content</h1>

      {/* Language Switcher */}
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>

      {/* Load on Demand */}
      <button onClick={handleLoadAchievements} disabled={loadingAchievements}>
        {loadingAchievements ? 'Loading...' : 'Load Achievements'}
      </button>

      {/* Display Achievements */}
      {achievements && (
        <div className="achievements">
          <h2>Achievements</h2>
          {achievements.map((achievement: any) => (
            <div key={achievement.id} className="achievement-card">
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <span className="badge">{achievement.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Multi-Language Content Comparison
 */
export function LanguageComparisonExample() {
  const { languages } = useLanguage();
  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'ta']);
  const [comparisonData, setComparisonData] = useState<
    Record<string, any>
  >({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadComparison = async () => {
      setLoading(true);
      const data: Record<string, any> = {};

      for (const lang of selectedLanguages) {
        const { loadLanguageData } = await import('@/lib/utils');
        const contentLabels = await loadLanguageData(lang, 'contentLabels');
        data[lang] = contentLabels;
      }

      setComparisonData(data);
      setLoading(false);
    };

    loadComparison();
  }, [selectedLanguages]);

  return (
    <div className="language-comparison">
      <h1>Language Content Comparison</h1>

      {/* Language Selection */}
      <div className="language-selector">
        {languages.map((lang) => (
          <label key={lang.code}>
            <input
              type="checkbox"
              value={lang.code}
              checked={selectedLanguages.includes(lang.code)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedLanguages([...selectedLanguages, lang.code]);
                } else {
                  setSelectedLanguages(
                    selectedLanguages.filter((l) => l !== lang.code)
                  );
                }
              }}
            />
            {lang.flag} {lang.nativeName}
          </label>
        ))}
      </div>

      {/* Comparison Table */}
      {loading && <div>Loading...</div>}

      {!loading && Object.keys(comparisonData).length > 0 && (
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Key</th>
              {selectedLanguages.map((lang) => (
                <th key={lang}>{lang}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(comparisonData[selectedLanguages[0]] || {}).map(
              ([key]) => (
                <tr key={key}>
                  <td>{key}</td>
                  {selectedLanguages.map((lang) => (
                    <td key={`${lang}-${key}`}>
                      {comparisonData[lang]?.[key]}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

/**
 * Example 6: Error Handling and Recovery
 */
export function ErrorHandlingExample() {
  const { language, changeLanguage, languages } = useLanguage();
  const { getData, error, isLoading, reloadContent } = useLanguageContent({
    dataTypes: ['projects'],
  });

  const projects = getData('projects');

  return (
    <div className="error-handling-example">
      <h1>Error Handling Example</h1>

      {/* Language Switcher */}
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-message">
          Loading content for {language}...
        </div>
      )}

      {/* Error State with Recovery */}
      {error && (
        <div className="error-message">
          <h2>⚠️ Error Loading Content</h2>
          <p>{error}</p>
          <button onClick={reloadContent}>Retry Loading</button>
          <p className="hint">
            This usually happens when the language data is not available.
            Switching languages or retrying might help.
          </p>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && projects && (
        <div className="success-message">
          <h2>✅ Content Loaded Successfully</h2>
          <p>Found {projects.length} projects in {language}</p>
          <ul>
            {projects.map((project: any) => (
              <li key={project.id}>{project.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function LanguageExamplesPage() {
  const [activeExample, setActiveExample] = useState<
    'switcher' | 'layout' | 'portfolio' | 'lazy' | 'comparison' | 'error'
  >('switcher');

  return (
    <div className="language-examples">
      <h1>Language System Examples</h1>

      {/* Example Selector */}
      <div className="example-selector">
        <button
          onClick={() => setActiveExample('switcher')}
          className={activeExample === 'switcher' ? 'active' : ''}
        >
          1. Language Switcher
        </button>
        <button
          onClick={() => setActiveExample('layout')}
          className={activeExample === 'layout' ? 'active' : ''}
        >
          2. Page Layout
        </button>
        <button
          onClick={() => setActiveExample('portfolio')}
          className={activeExample === 'portfolio' ? 'active' : ''}
        >
          3. Portfolio Data
        </button>
        <button
          onClick={() => setActiveExample('lazy')}
          className={activeExample === 'lazy' ? 'active' : ''}
        >
          4. Lazy Loading
        </button>
        <button
          onClick={() => setActiveExample('comparison')}
          className={activeExample === 'comparison' ? 'active' : ''}
        >
          5. Language Comparison
        </button>
        <button
          onClick={() => setActiveExample('error')}
          className={activeExample === 'error' ? 'active' : ''}
        >
          6. Error Handling
        </button>
      </div>

      {/* Example Content */}
      <div className="example-content">
        {activeExample === 'switcher' && <LanguageSwitcherExample />}
        {activeExample === 'layout' && <PageLayoutExample />}
        {activeExample === 'portfolio' && <PortfolioDataExample />}
        {activeExample === 'lazy' && <LazyLoadingExample />}
        {activeExample === 'comparison' && <LanguageComparisonExample />}
        {activeExample === 'error' && <ErrorHandlingExample />}
      </div>
    </div>
  );
}
