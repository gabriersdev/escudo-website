import React from 'react';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {NewsletterSection} from '@/components/newsletter';
import {Metadata} from 'next';
import {appConfigs} from "@/resources/resources";

export const metadata: Metadata = {
  title: `Subscribe | ${appConfigs["app-name"]}`,
  description: 'Subscribe to our newsletter.',
};

export default function SubscribePage() {
  return (
    <div className=" text-gray-900 font-sans">
      <Header/>
      
      <main className="bg-blue-600 flex items-center justify-center">
        <div className={"mb-16 mt-20 pb-28"}>
          <NewsletterSection/>
        </div>
      </main>
      
      <Footer/>
    </div>
  );
}
