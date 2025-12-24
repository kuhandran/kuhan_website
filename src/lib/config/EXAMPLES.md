/**
 * Example Usage of App Configuration
 * Shows how to integrate appConfig into your components and API routes
 */

// ============================================
// EXAMPLE 1: Using in React Components
// ============================================

import { useEffect, useState } from 'react';
import { getUrlSync, getErrorMessageSync } from '@/lib/config/appConfig';

export function ContactFormExample() {
  const contactUrl = getUrlSync('fullUrls.contact');
  const errorMsg = getErrorMessageSync('contact.validation.missingFields');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch(contactUrl, {
        method: 'POST',
        body: new FormData(e.currentTarget),
      });
      
      if (!response.ok) {
        throw new Error(getErrorMessageSync('contact.submission.failed'));
      }
      
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert(error instanceof Error ? error.message : getErrorMessageSync('common.unknownError'));
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}

// ============================================
// EXAMPLE 2: Using in API Routes
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessageSync, getUrlSync } from '@/lib/config/appConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate using error messages
    if (!body.email) {
      return NextResponse.json(
        { error: getErrorMessageSync('validation.required') },
        { status: 400 }
      );
    }
    
    // Use configured URLs
    const externalApiUrl = getUrlSync('fullUrls.externalApi');
    const response = await fetch(externalApiUrl, { method: 'POST', body });
    
    if (!response.ok) {
      throw new Error(getErrorMessageSync('network.httpError'));
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessageSync('common.unknownError') },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 3: File Upload with Validation
// ============================================

export function FileUploadExample() {
  const invalidTypeMsg = getErrorMessageSync('contact.file.invalidType');
  const invalidSizeMsg = getErrorMessageSync('contact.file.invalidSize');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      alert(invalidTypeMsg);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert(invalidSizeMsg);
      return;
    }
    
    // File is valid
  };
  
  return <input type="file" onChange={handleFileChange} />;
}

// ============================================
// EXAMPLE 4: Using Async Config in Effects
// ============================================

import { useEffect, useState } from 'react';
import { getUrl, getErrorMessage } from '@/lib/config/appConfig';

export function DataFetchExample() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get configured URL asynchronously
        const apiUrl = await getUrl('fullUrls.apiEndpoint');
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(await getErrorMessage('network.httpError'));
        }
        
        const json = await response.json();
        setData(json);
        
      } catch (err) {
        setError(
          err instanceof Error ? err.message : await getErrorMessage('common.unknownError')
        );
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {data && <p className="text-green-500">Data loaded successfully</p>}
    </div>
  );
}

// ============================================
// EXAMPLE 5: CDN URL Construction
// ============================================

export function CDNUrlBuilderExample() {
  // Get full CDN base URL
  const cdnBase = getUrlSync('fullUrls.cdnBase');
  
  // Construct specific URLs
  const profileImageUrl = `${cdnBase}/images/profile.png`;
  const dataEndpoint = `${cdnBase}/data/contentLabels.json`;
  
  return (
    <div>
      <img src={profileImageUrl} alt="Profile" />
      <link rel="preload" as="fetch" href={dataEndpoint} />
    </div>
  );
}

// ============================================
// EXAMPLE 6: Error Message with Context
// ============================================

export function SmartErrorDisplay({ error }: { error: Error | null }) {
  const getMessageWithContext = (err: Error): string => {
    if (err.message.includes('network')) {
      return getErrorMessageSync('network.connectionError');
    }
    if (err.message.includes('timeout')) {
      return getErrorMessageSync('network.timeout');
    }
    if (err.message.includes('file')) {
      return getErrorMessageSync('file.uploadFailed');
    }
    return getErrorMessageSync('common.unknownError');
  };
  
  if (!error) return null;
  
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
      <p className="font-bold">{getErrorMessageSync('messages.error.title')}</p>
      <p>{getMessageWithContext(error)}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Multi-Language Support
// ============================================

async function loadConfigForLanguage(language: string) {
  // This example shows how to extend appConfig.ts for multi-language
  const langSuffix = language !== 'en' ? `-${language}` : '';
  const messagesUrl = `/data/errorMessages${langSuffix}.json`;
  const urlsUrl = `/config/urlConfig${langSuffix}.json`;
  
  const messagesResponse = await fetch(messagesUrl);
  const urlsResponse = await fetch(urlsUrl);
  
  if (messagesResponse.ok && urlsResponse.ok) {
    const messages = await messagesResponse.json();
    const urls = await urlsResponse.json();
    return { messages, urls };
  }
  
  throw new Error(`Language ${language} not found`);
}

// Usage in component:
// const config = await loadConfigForLanguage('es'); // Load Spanish config
