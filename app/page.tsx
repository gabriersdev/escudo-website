import React from 'react';
import {getPosts, getTopics} from '@/libs/mdx';
import Base from '@/components/base';
import {AppSidebar} from '@/components/app-sidebar';
import {FeaturedPost} from '@/components/featured-post';
import {PostCard} from '@/components/post-card';
import {Metadata} from 'next';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";

export const metadata: Metadata = {
  title: appConfigs.title,
  description: appConfigs.description,
};

export default function Home() {
  const posts = getPosts();
  const topics = getTopics();
  
  const featuredPost = posts.find(p => p.metadata.featured) || posts[0];
  const otherPosts = posts.filter(p => p.slug !== featuredPost?.slug);
  
  return (
    <Base>
      <div className="flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="w-full lg:flex-1 lg:pr-16">
          {featuredPost && (
            <FeaturedPost slug={featuredPost.slug} metadata={featuredPost.metadata}/>
          )}
          
          {otherPosts.length > 0 && (
            <div className="mt-20">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6 border-b border-gray-100 pb-2">
                {dictionary.home.moreIssues}
              </div>
              <div className="flex flex-col">
                {otherPosts
                  .toSpliced(15)
                  .map((post) => (
                    <PostCard key={post.slug} slug={post.slug} metadata={post.metadata}/>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <AppSidebar excludeSlug={featuredPost?.slug}/>
      </div>
    </Base>
  );
}
