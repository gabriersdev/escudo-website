import React from 'react';
import fs from 'fs';
import path from 'path';
import {MDXRemote} from 'next-mdx-remote/rsc';
import Base from '@/components/base';
import {Metadata} from 'next';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";
import {PageHeading} from '@/components/page-heading';
import {AppSidebar} from "@/components/app-sidebar";
import {mdxComponents} from "@/components/mdx-components";

export const metadata: Metadata = {
  title: `${dictionary.privacy.title} | ${appConfigs["app-name"]}`,
  description: dictionary.privacy.description,
};

export default async function Privacy() {
  const contentPath = path.join(process.cwd(), 'resources', 'privacy.mdx');
  const content = fs.readFileSync(contentPath, 'utf8');
  
  return (
    <Base>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:flex-1 lg:pr-16">
          <PageHeading
            title={dictionary.privacy.title}
            description={dictionary.privacy.description}
          />
          
          <div className="markdown-content">
            <MDXRemote source={content} components={mdxComponents}/>
          </div>
        </div>
        
        <AppSidebar hideAbout={false}/>
      </div>
    </Base>
  );
}
