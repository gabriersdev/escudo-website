import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from "next/link";
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {getPostBySlug, getPosts} from '@/libs/mdx';
import Base from '@/components/base';
import {ShareButton} from '@/components/share-button';
import {SocialShare} from '@/components/social-share';
import {appConfigs, siteUrl} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";
import {mdxComponents} from "@/components/mdx-components";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Generates dynamic metadata
export async function generateMetadata({params}: PageProps) {
  const {slug} = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: `Post Not Found - ${appConfigs["app-name"]}`,
      description: 'The requested post could not be found.',
    };
  }
  
  const postUrl = `${siteUrl}/${slug}`;
  
  return {
    title: `${post.metadata.title} - ${appConfigs["app-name"]}`,
    description: post.metadata.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: 'article',
      url: postUrl,
      siteName: appConfigs["app-name"],
      publishedTime: post.metadata.date,
      authors: [post.metadata.author],
      ...(post.metadata.image && {
        images: [
          {
            url: post.metadata.image,
            width: 1200,
            height: 630,
            alt: post.metadata.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.description,
      ...(post.metadata.image && {images: [post.metadata.image]}),
    },
  };
}

// Generates static params for all posts
export function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({params}: PageProps) {
  const {slug} = await params;
  const guidePath = path.join(process.cwd(), 'resources', 'post-info.mdx');
  const guideContent = fs.readFileSync(guidePath, 'utf8');
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.slug === slug);
  const post = postIndex !== -1 ? posts[postIndex] : null;
  
  if (!post) {
    notFound();
  }
  
  const prevPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : null;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.metadata.title,
    description: post.metadata.description,
    image: post.metadata.image ? [`${siteUrl}${post.metadata.image}`] : [],
    datePublished: post.metadata.date,
    author: {
      '@type': 'Person',
      name: post.metadata.author,
    },
    publisher: {
      '@type': 'Organization',
      name: appConfigs["app-name"],
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${slug}`,
    },
  };
  
  return (
    <Base hideInstagram={true} mainClassName="container mx-auto px-4 max-w-4xl pt-16 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      
      <article>
        {/* Post Header */}
        <header className="mb-12">
          <div className="text-[12px] uppercase tracking-wide mb-4 flex items-center flex-wrap gap-1">
            <div><span className={"text-gray-500 font-medium"}>{dictionary.post.by}</span> <span className={" text-gray-900 font-semibold"}>{post.metadata.author}</span></div>
            <div><span className={"text-gray-500 font-medium"}>{dictionary.post.in}</span> <span className={" text-[#2631FF] font-semibold"}>{post.metadata.topic}</span></div>
            <span className="text-blue-300">-</span>
            <span className={"text-gray-500"}>{post.metadata.date}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.1] mb-6">
            {post.metadata.title}
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-700 leading-snug">
            {post.metadata.description}
          </p>
        </header>
        
        {/* Cover Image Placeholder */}
        <div className="w-full aspect-[2/1] bg-gray-100 rounded mb-16 flex items-center justify-center text-gray-300 overflow-hidden relative">
          {post.metadata.image ? (
            <img src={post.metadata.image} alt={post.metadata.title} className="w-full h-full object-cover"/>
          ) : (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          )}
        </div>
        
        {/* Post Content rendered by next-mdx-remote */}
        <div className="markdown-content max-w-3xl mx-auto">
          <MDXRemote source={post.content} components={mdxComponents}/>
        </div>
        
        {/* Internal Footer for post */}
        <div className="max-w-3xl mx-auto flex flex-col gap-8 mt-16">
          <div>
            <span className={"text-gray-500 font-medium tracking-wide uppercase text-[12px]"}>{dictionary.post.share}</span>
            <SocialShare title={post.metadata.title}/>
            <hr className="mt-8 border-gray-100 max-w-3xl mx-auto"/>
          </div>
          
          <div className="markdown-content opacity-75">
            <MDXRemote source={guideContent} components={mdxComponents}/>
          </div>
        
        </div>
        
        <div className="flex flex-wrap gap-4 justify-between items-center mt-10 pt-8 border-t border-gray-300">
          {prevPost ? (
            <Link href={`/${prevPost.slug}`} className="flex flex-col gap-2 flex-1">
              <h3 className="text-xl font-bold uppercase font-inter flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left">
                  <path d="m12 19-7-7 7-7"/>
                  <path d="M19 12H5"/>
                </svg>
                <span>{dictionary.post.previous}</span>
              </h3>
              <span className={"line-clamp-1"}>{prevPost.metadata.title}</span>
            </Link>
          ) : (
            <div className="flex-1"></div>
          )}
          
          <div className="flex-1 flex justify-center">
            <ShareButton title={post.metadata.title}/>
          </div>
          
          {nextPost ? (
            <Link href={`/${nextPost.slug}`} className="flex flex-col gap-2 items-end flex-1 text-right">
              <h3 className="text-xl font-bold uppercase font-inter flex items-center justify-end gap-1">
                <span>{dictionary.post.next}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </h3>
              <span className="text-right line-clamp-1">{nextPost.metadata.title}</span>
            </Link>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
      </article>
    </Base>
  );
}
