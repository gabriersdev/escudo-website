import React from 'react';
import {getPosts, getTopics} from '@/libs/mdx';
import Base from '@/components/base';
import {Sidebar} from '@/components/sidebar';
import {PostCard} from '@/components/post-card';
import {Metadata} from 'next';
import {PageHeading} from '@/components/page-heading';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";

export const metadata: Metadata = {
  title: `${dictionary.collection.title} | ${appConfigs["app-name"]}`,
  description: dictionary.collection.description.replace("{{count}}", getPosts().length.toString()),
};

export default function CollectionPage() {
  const posts = getPosts();
  const topics = getTopics();
  
  const features = posts.slice(0, 4).map(p => ({
    title: p.metadata.title,
    description: p.metadata.description,
    date: p.metadata.date,
    readTime: p.metadata.readTime,
    slug: p.slug
  }));
  
  return (
    <Base>
      <div className="flex flex-col lg:flex-row">
        
        <div className="w-full lg:flex-1 lg:pr-16">
          <PageHeading
            title={dictionary.collection.title}
            description={dictionary.collection.description.replace("{{count}}", posts.length.toString())}
          />
          
          <div className="flex flex-col mt-8">
            {posts.map((post) => (
              <PostCard key={post.slug} slug={post.slug} metadata={post.metadata}/>
            ))}
          </div>
        </div>
        
        <Sidebar features={features} topics={topics}/>
      </div>
    </Base>
  );
}
