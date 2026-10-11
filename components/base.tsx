import React from 'react';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {NewsletterSection} from '@/components/newsletter';
import {InstagramBanner} from '@/components/instagram-banner';

interface BaseProps {
  children: React.ReactNode;
  hideNewsletter?: boolean;
  hideInstagram?: boolean;
  mainClassName?: string;
  wrapperClassName?: string;
  marginBottom?: boolean
}

export default function Base(
  {
    children,
    hideNewsletter = false,
    hideInstagram = false,
    mainClassName = "container mx-auto px-4 max-w-6xl pt-16",
    wrapperClassName = "bg-white min-h-screen text-gray-900 font-sans",
    marginBottom = true,
  }: BaseProps
) {
  return (
    <div className={wrapperClassName}>
      <Header/>
      <main className={mainClassName}>
        {children}
      </main>
      
      <div className={mainClassName + (marginBottom ? " mb-5" : "") + " flex gap-4 items-stretch  flex-col min-[1120px]:flex-row"}>
        {!hideInstagram && <InstagramBanner/>}
        {!hideNewsletter && <NewsletterSection/>}
      </div>
      <Footer/>
    </div>
  );
}
