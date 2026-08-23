"use client";

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {PostData} from '../libs/mdx';
import {dictionary} from "@/resources/dictionary";

interface SearchModalProps {
  posts: PostData[];
}

export function SearchModal({posts}: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  
  // Derive unique topics from posts (max 10)
  const uniqueTopics = React.useMemo(() => {
    return Array.from(
      new Set(posts.map((post) => post.metadata.topic).filter((topic): topic is string => !!topic))
    ).slice(0, 10);
  }, [posts]);
  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!isOpen && dialog.open) {
      dialog.close();
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle native escape key closing
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setIsOpen(false);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);
  
  const filteredPosts = posts.filter((post) => {
    if (!query) return false;
    else if (query.trim().length === 0) return false;
    const lowerQuery = query.trim().toLowerCase();
    return (
      post.metadata.title.toLowerCase().includes(lowerQuery) ||
      post.metadata.description.toLowerCase().includes(lowerQuery) ||
      (post.metadata.topic && post.metadata.topic.toLowerCase().includes(lowerQuery))
    );
  });
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-900 flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Search posts"
      >
        <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>
      
      {/* Native dialog wraps the modal content */}
      <dialog
        ref={dialogRef}
        className={`backdrop:bg-gray-900/20 backdrop:backdrop-blur-sm bg-transparent fixed inset-0 z-50 m-0 w-full max-w-none h-full items-start justify-center pt-24 ${isOpen ? 'flex' : 'hidden'}`}
        onClick={(e) => {
          if (e.target === dialogRef.current) setIsOpen(false);
        }}
      >
        {isOpen && (
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-400 overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center">
              <svg className="w-4 h-4 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                className="w-full outline-none placeholder-gray-400 bg-transparent text-gray-900"
                placeholder={dictionary.search.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="min-h-[300px] max-h-[60vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-[13px] font-bold text-gray-900 mb-4 px-2">{dictionary.search.posts}</h3>
                {query && filteredPosts.length > 0 ? (
                  <ul className="space-y-4">
                    {filteredPosts.map((post) => (
                      <li key={post.slug}>
                        <Link href={`/${post.slug}`} className="block px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors group" onClick={() => setIsOpen(false)}>
                          <h4 className="font-bold text-gray-900 text-[15px] leading-tight group-hover:text-blue-600 transition-colors">
                            {highlightMatch(post.metadata.title, query)}
                          </h4>
                          <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {post.metadata.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : query && filteredPosts.length === 0 ? (
                  <div>
                    <p className="text-sm text-gray-500 px-2 ps-2">{dictionary.search.noResults} </p>
                    <div className={"flex gap-2 flex-wrap items-center mt-3 ms-2"}>
                      {uniqueTopics
                        .toSpliced(10)
                        .map((topic, i) => {
                          const bgColors = ['bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-500', 'bg-blue-600'];
                          const textColors = ['text-gray-900', 'text-gray-900', 'text-gray-900', 'text-white', 'text-white'];
                          const colorIndex = i % bgColors.length;
                          return (
                            <Link
                              key={topic}
                              href={`/topic/${encodeURIComponent(topic.toLowerCase().replace(/\s+/g, '-'))}`}
                              onClick={() => setIsOpen(false)}
                              className={`${bgColors[colorIndex]} ${textColors[colorIndex]} text-sm px-3 py-1 rounded-full hover:opacity-80 transition-opacity`}
                            >
                              {topic}
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 ps-2">{dictionary.search.typeToStart}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-300">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
