"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {checkPageExists} from '@/app/actions/check-page';

interface PageHeadingProps {
  title: React.ReactNode;
  description: React.ReactNode;
}

const breadcrumbTranslations: Record<string, string> = {
  home: 'Início',
  topic: 'Tópico',
  about: 'Sobre',
  authors: 'Autores',
  posts: 'Postagens',
  privacy: 'Privacidade',
  collection: 'Coleção'
};

export function PageHeading({title, description}: PageHeadingProps) {
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];
  
  const [validLinks, setValidLinks] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const checkLinks = async () => {
      const results: Record<string, boolean> = {};
      
      for (let i = 0; i < segments.length - 1; i++) {
        const href = `/${segments.slice(0, i + 1).join('/')}`;
        if (validLinks[href] === undefined) {
          try {
            results[href] = await checkPageExists(href);
          } catch {
            results[href] = false;
          }
        }
      }
      
      if (Object.keys(results).length > 0) {
        setValidLinks(prev => ({...prev, ...results}));
      }
    };
    
    if (segments.length > 1) {
      checkLinks();
    }
  }, [pathname, segments, validLinks]);
  
  return (
    <div className="mb-10">
      <div className="mb-5 text-sm flex flex-wrap gap-1 items-center max-w-xl">
        <Link href="/" className="text-blue-400 hover:text-blue-500 transition-colors">
          {breadcrumbTranslations['home'] || 'Home'}
        </Link>
        
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          
          const label = breadcrumbTranslations[segment.toLowerCase()] || segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          const isLinkValid = validLinks[href];
          
          return (
            <React.Fragment key={href}>
              <span className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dot" viewBox="0 0 16 16">
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                </svg>
              </span>
              
              {isLast ? (
                <span className="text-blue-600 font-medium">
                  {label}
                </span>
              ) : isLinkValid ? (
                <Link
                  href={href}
                  className="text-blue-400 hover:text-blue-500 transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <span className="text-gray-500">
                  {label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500 text-sm">
        {description}
      </p>
    </div>
  );
}
