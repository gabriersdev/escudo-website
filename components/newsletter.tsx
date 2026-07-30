"use client";

import React, {useState} from 'react';
import {dictionary} from "@/resources/dictionary";

type NewsletterFormProps = {
  variant?: 'large' | 'compact';
};

export function NewsletterForm({variant = 'large'}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Centralized submission logic could go here
    console.log('Subscribed:', email);
    alert(`${dictionary.newsletter.subscribedAlert} ${email}`);
    setEmail('');
  };
  
  if (variant === 'compact') {
    return (
      <form className="flex w-full bg-white rounded border border-gray-200 overflow-hidden" onSubmit={handleSubmit}>
        <div className="pl-3 flex items-center justify-center text-gray-400 bg-gray-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dictionary.newsletter.placeholder}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none transition-colors"
          required
        />
        <button
          type="submit"
          className="bg-white text-blue-600 hover:text-blue-700 text-xs font-bold uppercase px-4 py-2 transition-colors border-l border-gray-200"
        >
          {dictionary.newsletter.subscribeButton}
        </button>
      </form>
    );
  }
  
  return (
    <form className="flex w-full max-w-md mx-auto bg-white rounded-md py-1 overflow-hidden relative" onSubmit={handleSubmit}>
      <div className="pl-5 flex items-center justify-center text-gray-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={dictionary.newsletter.placeholder}
        className="w-full px-2 py-3 text-gray-900 bg-transparent focus:outline-none focus:ring-0"
        required
      />
      <button
        type="submit"
        className="bg-white text-blue-600 hover:text-blue-700 text-xs font-bold uppercase px-4 py-2 rounded-full absolute right-1 top-1 bottom-1 transition-colors"
      >
        {dictionary.newsletter.subscribeButton}
      </button>
    </form>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-blue-600 text-white py-24 text-center mt-20 w-full">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {dictionary.newsletter.subscribeTitle}
        </h2>
        <p className="text-white text-xl font-light mb-8 max-w-lg mx-auto">
          {dictionary.newsletter.subscribeDescription}
        </p>
        <NewsletterForm variant="large"/>
      </div>
    </section>
  );
}
