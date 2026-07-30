import React from 'react';
import fs from 'fs';
import path from 'path';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {AppSidebar} from '@/components/app-sidebar';
import {PageHeading} from '@/components/page-heading';
import {NewsletterSection} from '@/components/newsletter';
import {Metadata} from 'next';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";

export const metadata: Metadata = {
  title: `About | ${appConfigs["app-name"]}`,
  description: 'Learn more about The Journal, our mission, and the stories we share.',
};

export default async function About() {
  const contentPath = path.join(process.cwd(), 'resources', 'about.md');
  const content = fs.readFileSync(contentPath, 'utf8');

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <Header/>
      
      <main className="container mx-auto px-4 max-w-6xl pt-16">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:flex-1 lg:pr-16">
            <PageHeading
              title={dictionary.about.title}
              description={appConfigs["app-name"]}
            />
            
            <div className="markdown-content">
              <MDXRemote source={content} />
            </div>
          </div>
          
          <AppSidebar hideAbout={true} />
        </div>
      </main>
      
      <NewsletterSection/>
      <Footer/>
    </div>
  );
}
