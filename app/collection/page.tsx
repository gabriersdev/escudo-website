import React from 'react';
import {getPosts, getTopics} from '@/libs/mdx';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {Sidebar} from '@/components/sidebar';
import {PostCard} from '@/components/post-card';
import {NewsletterSection} from '@/components/newsletter';
import {Metadata} from 'next';
import {PageHeading} from '@/components/page-heading';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";
import {InstagramBanner} from "@/components/instagram-banner";

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
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <Header/>
      
      <main className="container mx-auto px-4 max-w-6xl pt-16">
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
      </main>
      
      <InstagramBanner/>
      <NewsletterSection/>
      <Footer/>
    </div>
  );
}
