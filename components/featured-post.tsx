import Link from 'next/link';
import {PostMetadata} from '@/libs/mdx';
import {dictionary} from "@/resources/dictionary";

type FeaturedPostProps = {
  slug: string;
  metadata: PostMetadata;
};

export function FeaturedPost({slug, metadata}: FeaturedPostProps) {
  return (
    <div className="mb-16">
      <div className="text-xs font-bold text-blue-600 uppercase mb-3 flex items-center flex-wrap gap-1">
        <span>{dictionary.post.latest}</span>
        <span className="text-blue-300">-</span>
        <span>{metadata.date}</span>
      </div>
      
      <Link href={`/${slug}`} className="block group">
        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] mb-6 group-hover:text-blue-600 transition-colors">
          {metadata.title}
        </h1>
      </Link>
      
      <p className="text-xl md:text-2xl text-gray-700 leading-snug mb-6 max-w-3xl">
        {metadata.description}
      </p>
      
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {metadata.readTime}
      </div>
    </div>
  );
}
