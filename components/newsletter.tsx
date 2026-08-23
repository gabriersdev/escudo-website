"use client";

import React, {useState} from 'react';
import {dictionary} from "@/resources/dictionary";

type NewsletterFormProps = {
  variant?: 'large' | 'compact';
};

export function NewsletterForm({variant = 'large'}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || email.trim() === '') {
      setStatus('error');
      setErrorMessage(dictionary.newsletter.emailRequired);
      return;
    }
    
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage(dictionary.newsletter.emailInvalid);
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          hash: honeypot === '' ? process.env.NEXT_PUBLIC_HASH_VALIDATION_TRANSACTION : ''
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(dictionary.newsletter.errorMessage);
    }
  };
  
  if (variant === 'compact') {
    return (
      <div className="w-full">
        <form className="flex w-full bg-white rounded border border-gray-200 overflow-hidden" onSubmit={handleSubmit}>
          <div className="pl-3 flex items-center justify-center text-gray-400 bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <input
            type="text"
            name="company"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="opacity-0 absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dictionary.newsletter.placeholder}
            className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none transition-colors"
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-blue-600 hover:text-blue-700 text-sm font-bold uppercase px-4 py-2 transition-colors border-l border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === 'loading' ? dictionary.newsletter.loading : dictionary.newsletter.subscribeButton}
          </button>
        </form>
        {status === 'error' && (
          <p className="text-red-500 text-sm mt-2 text-left px-1">{errorMessage}</p>
        )}
        {status === 'success' && (
          <p className="text-green-600 text-sm mt-2 text-left px-1">{dictionary.newsletter.successMessage}</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form className="flex w-full bg-white rounded-md py-1 overflow-hidden relative" onSubmit={handleSubmit}>
        <div className="pl-5 flex items-center justify-center text-gray-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="opacity-0 absolute -left-[9999px]"
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dictionary.newsletter.placeholder}
          className="w-full px-2 py-3 text-gray-900 bg-transparent focus:outline-none focus:ring-0"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-white text-blue-600 hover:text-blue-700 text-sm font-bold uppercase px-4 py-2 rounded-full absolute right-1 top-1 bottom-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? dictionary.newsletter.loading : dictionary.newsletter.subscribeButton}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-300 text-sm mt-2 text-left px-2 font-medium">{errorMessage}</p>
      )}
      {status === 'success' && (
        <p className="text-green-300 text-sm mt-2 text-left px-2 font-medium">{dictionary.newsletter.successMessage}</p>
      )}
    </div>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-blue-600 text-white py-24 text-center w-full rounded-xl">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {dictionary.newsletter.subscribeTitle}
        </h2>
        <p className="text-white/90 text-xl max-w-lg mx-auto tracking-tight text-balance mb-8">
          {dictionary.newsletter.subscribeDescription}
        </p>
        <NewsletterForm variant="large"/>
      </div>
    </section>
  );
}
