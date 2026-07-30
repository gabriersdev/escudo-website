"use client";
import React, {useState} from 'react';
import {dictionary} from "@/resources/dictionary";

type ShareButtonProps = {
  title: string;
};

export function ShareButton({title}: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (err) {
        // Share cancelled or failed, fallback to copy if we want, but usually we just ignore
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error(dictionary.share.failedToCopy, err);
      }
    }
  };
  
  if (isCopied) {
    return (
      <button
        className="px-4.5 py-2 border rounded-full font-semibold bg-green-300 border-green-300 text-green-700 pointer-events-none"
        disabled
      >
        {dictionary.share.copied}
      </button>
    );
  }
  
  return (
    <button
      onClick={handleShare}
      className="px-4.5 py-2 border border-gray-300 hover:border-gray-400 rounded-full font-semibold transition-colors"
    >
      {dictionary.share.shareButton}
    </button>
  );
}
