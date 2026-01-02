'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getConfigRouteUrl } from '@/lib/config/domains';

export default function ConfigPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
  const [configType, setConfigType] = useState<'apiConfig' | 'pageLayout' | 'urlConfig'>('apiConfig');
  const [configData, setConfigData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = getConfigRouteUrl(selectedLanguage, configType);
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setConfigData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConfigData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [selectedLanguage, configType]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>Configuration Browser</h1>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="language" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
            Language:
          </label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang} {lang === DEFAULT_LANGUAGE ? '(default)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="configType" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
            Config Type:
          </label>
          <select
            id="configType"
            value={configType}
            onChange={(e) => setConfigType(e.target.value as any)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          >
            <option value="apiConfig">apiConfig</option>
            <option value="pageLayout">pageLayout</option>
            <option value="urlConfig">urlConfig</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Fetching from:</strong>
        <code style={{
          display: 'block',
          backgroundColor: '#f5f5f5',
          padding: '0.5rem',
          borderRadius: '4px',
          marginTop: '0.5rem',
          wordBreak: 'break-all',
        }}>
          {getConfigRouteUrl(selectedLanguage, configType)}
        </code>
      </div>

      {loading && <p>Loading...</p>}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          color: '#c00',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {configData && (
        <div>
          <h2>Configuration Data:</h2>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '600px',
          }}>
            {JSON.stringify(configData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
