import React from 'react';
import {getPosts, getTopics} from '@/libs/mdx';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {Sidebar} from '@/components/sidebar';
import {PostCard} from '@/components/post-card';
import {NewsletterSection} from '@/components/newsletter';
import {getAuthorBySlug} from '@/resources/authors';
import {notFound} from 'next/navigation';
import {PageHeading} from '@/components/page-heading';
import {appConfigs} from "@/resources/resources";

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const author = getAuthorBySlug(resolvedParams.slug);
  if (!author) {
    return {title: 'Author Not Found'};
  }
  return {
    title: `${author.name} | ${appConfigs["app-name"]}`,
    description: author.bio,
  };
}

export default async function AuthorPage({params}: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const author = getAuthorBySlug(resolvedParams.slug);
  
  if (!author) {
    notFound();
  }
  
  const posts = getPosts().filter(post => post.metadata.author === author.name || post.metadata.author.toUpperCase() === author.name.toUpperCase());
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
          
          {/* Main Content Area */}
          <div className="w-full lg:flex-1 lg:pr-16">
            <PageHeading
              title={`Posts by ${author.name}`}
              description={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'} published`}
            />
            
            {posts.length > 0 ? (
              <div className="flex flex-col">
                {posts.map((post) => (
                  <PostCard key={post.slug} slug={post.slug} metadata={post.metadata}/>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No posts found for this author.</p>
            )}
          </div>
          
          {/* Right Sidebar */}
          <Sidebar features={features} topics={topics} author={author}/>
        
        </div>
      </main>
      
      <NewsletterSection/>
      <Footer/>
    </div>
  );
}
