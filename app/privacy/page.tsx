import React from 'react';
import fs from 'fs';
import path from 'path';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {NewsletterSection} from '@/components/newsletter';
import {Metadata} from 'next';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";
import {PageHeading} from '@/components/page-heading';
import {Sidebar} from "@/components/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {mdxComponents} from "@/components/mdx-components";

export const metadata: Metadata = {
  title: `Data + Privacy | ${appConfigs["app-name"]}`,
  description: 'Terms of service and privacy policy.',
};

export default async function Privacy() {
  const contentPath = path.join(process.cwd(), 'resources', 'privacy.mdx');
  const content = fs.readFileSync(contentPath, 'utf8');
  
  
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <Header/>
      
      <main className="container mx-auto px-4 max-w-6xl pt-16">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:flex-1 lg:pr-16">
            <PageHeading
              title="Data + privacy"
              description="Terms of service and privacy policy for our platform."
            />
            
            <div className="markdown-content">
              <MDXRemote source={content} components={mdxComponents} />
            </div>
          </div>
          
          <AppSidebar hideAbout={false}/>
        </div>
      </main>
      
      <NewsletterSection/>
      <Footer/>
    </div>
  );
}
