import React from 'react';
import {getPosts, getTopics} from '@/libs/mdx';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {Sidebar} from '@/components/sidebar';
import {NewsletterSection} from '@/components/newsletter';
import {Metadata} from 'next';
import {authors} from '@/resources/authors';
import Link from 'next/link';
import Image from "next/image";
import {PageHeading} from '@/components/page-heading';
import {appConfigs} from "@/resources/resources";

export const metadata: Metadata = {
  title: `Authors | ${appConfigs["app-name"]}`,
  description: 'Meet the authors contributing thoughts, stories and ideas to The Journal.',
};

export default function Authors() {
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
              title="Our Authors"
              description="Who writes here?"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[...authors].map((author, i) => (
                <Link key={i} href={`/author/${author.slug}`} className={"group"}>
                  <div className="rounded-lg cursor-pointer hover:bg-gray-100 bg-gray-50" style={{padding: "2rem"}}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
                      <div className="w-24 h-24 flex-shrink-0 bg-black rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-sm relative">
                        {author.avatar ? (
                          <Image src={author.avatar} alt={author.name} width={300} height={300} className="object-cover w-full h-full"/>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl md:text-3xl font-semibold group-hover:text-blue-600 font-inter-tight">{author.name}</h2>
                        <p className="text-gray-600 mt-2 leading-relaxed line-clamp-3 text-sm">{author.bio}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <Sidebar hideAbout={true} features={features} topics={topics}/>
        </div>
      </main>
      
      <NewsletterSection/>
      <Footer/>
    </div>
  );
}
