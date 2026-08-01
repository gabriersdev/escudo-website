"use client";
import Link from 'next/link';
import {NewsletterForm} from './newsletter';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";
import Image from "next/image";

type SidebarProps = {
  features?: { title: string; date: string; readTime: string; slug: string; description: string }[];
  topics?: { name: string; count: number }[];
  author?: { name: string; bio: string; avatar: string | null; slug: string };
  hideAbout?: boolean;
};

function SidebarAbout({author}: { author?: SidebarProps['author'] }) {
  return (
    <section className="mb-12">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6 border-b border-gray-100 pb-2">
        {author ? dictionary.sidebar.aboutAuthor : dictionary.sidebar.about}
      </h3>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 aspect-square rounded-full flex items-center justify-center overflow-hidden relative shrink-0 bg-transparent">
          {author?.avatar ? (
            <Image src={author.avatar} alt={author.name} width={500} height={500} className="w-full h-full object-contain"/>
          ) : (
            <Image src={"/logo-bloco.png"} alt={"Logo do projeto"} width={500} height={500} className="w-full h-full object-contain"/>
          )}
        </div>
        <div>
          <h4 className="font-bold text-lg leading-tight">{author ? author.name : appConfigs["app-name"]}</h4>
          <p className="text-sm text-gray-500">{author ? dictionary.sidebar.author : dictionary.sidebar.thoughts}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {author ? author.bio : dictionary.sidebar.signUp}
      </p>
      {!author && <NewsletterForm variant="compact"/>}
    </section>
  );
}

function SidebarFeatures({features}: { features: NonNullable<SidebarProps['features']> }) {
  if (features.length === 0) return null;
  
  return (
    <section>
      <div className="mb-12">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6 border-b border-gray-100 pb-2">{dictionary.sidebar.features}</h3>
        <div className="space-y-6">
          {features
            .toSpliced(3)
            .map((feature, i) => (
              <div key={i} className="group cursor-pointer">
                <Link href={`/${feature.slug}`}>
                  <h4 className="font-bold font-inter text-md leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide flex items-center">
                    <span>{feature.date}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-400">{feature.readTime}</span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function SidebarTopics({topics}: { topics: NonNullable<SidebarProps['topics']> }) {
  if (topics.length === 0) return null;
  
  return (
    <section>
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6 border-b border-gray-100 pb-2">{dictionary.sidebar.topics}</h3>
        <div className="space-y-3">
          {topics
            .toSorted((a, b) => b.count - a.count)
            .toSpliced(5)
            .map((topic, i) => (
              <div key={i} className="group cursor-pointer hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                <Link href={`/topic/${topic.name.toLowerCase().replace(' ', '-')}`} className="font-semibold text-sm group-hover:text-blue-600 transition-colors w-full">
                  <div className={"flex items-center justify-between"}>
                    {topic.name}
                    
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-nowrap">
                  {topic.count} {topic.count === 1 ? dictionary.sidebar.post : dictionary.sidebar.posts}
                </span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export function Sidebar({features = [], topics = [], author, hideAbout = false}: SidebarProps) {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0 lg:pl-10 lg:border-l border-gray-100 mt-16 lg:mt-0">
      {!hideAbout && <SidebarAbout author={author}/>}
      <SidebarFeatures features={features}/>
      <SidebarTopics topics={topics}/>
    </aside>
  );
}
