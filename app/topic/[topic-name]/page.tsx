import React from 'react';
import {getPosts, getTopics} from '../../../libs/mdx';
import {Header} from '../../../components/header';
import {Footer} from '../../../components/footer';
import {Sidebar} from '../../../components/sidebar';
import {PostCard} from '../../../components/post-card';
import {NewsletterSection} from '../../../components/newsletter';
import {Metadata} from 'next';
import {PageHeading} from '../../../components/page-heading';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";

type Props = {
  params: Promise<{ 'topic-name': string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {'topic-name': topicNameEncoded} = await params;
  const topicName = decodeURIComponent(topicNameEncoded);
  const displayTopic = topicName.replace(/-/g, ' ');
  const formattedTopic = displayTopic.charAt(0).toUpperCase() + displayTopic.slice(1);
  
  return {
    title: `${formattedTopic} | ${appConfigs["app-name"]}`,
    description: `Posts related to ${formattedTopic}`,
  };
}

export default async function TopicPage({params}: Props) {
  const {'topic-name': topicNameEncoded} = await params;
  const topicName = decodeURIComponent(topicNameEncoded);
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  const targetSlug = slugify(topicName);
  
  const allPosts = getPosts();
  const topics = getTopics();
  
  const posts = allPosts.filter(
    (post) => post.metadata.topic && slugify(post.metadata.topic) === targetSlug
  );
  
  // Get top 4 other posts for features section
  const features = allPosts.slice(0, 4).map(p => ({
    title: p.metadata.title,
    description: p.metadata.description,
    date: p.metadata.date,
    readTime: p.metadata.readTime,
    slug: p.slug
  }));
  
  const matchedPost = posts[0];
  const displayTopic = matchedPost?.metadata.topic || topicName.replace(/-/g, ' ');
  const formattedTopic = displayTopic.charAt(0).toUpperCase() + displayTopic.slice(1);
  
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <Header/>
      
      <main className="container mx-auto px-4 max-w-6xl pt-16">
        <div className="flex flex-col lg:flex-row">
          
          {/* Main Content Area */}
          <div className="w-full lg:flex-1 lg:pr-16">
            <PageHeading
              title={`Topic: ${formattedTopic}`}
              description={`${posts.length || "No"} ${posts.length === 1 ? 'post' : 'posts'} found`}
            />
            
            {posts.length > 0 ? (
              <div className="flex flex-col mt-8">
                {posts.map((post) => (
                  <PostCard key={post.slug} slug={post.slug} metadata={post.metadata}/>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded border border-gray-100">
                <p className="text-gray-500 text-lg">{dictionary.topic.noPosts}</p>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <Sidebar features={features} topics={topics}/>
        
        </div>
      </main>
      
      <NewsletterSection/>
      <Footer/>
    </div>
  );
}
