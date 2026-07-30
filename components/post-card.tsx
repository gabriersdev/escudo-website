import Link from 'next/link';
import {PostMetadata} from '@/libs/mdx';

type PostCardProps = {
  slug: string;
  metadata: PostMetadata;
};

export function PostCard({slug, metadata}: PostCardProps) {
  return (
    <div className="py-10 border-b border-gray-100 last:border-0 group">
      <Link href={`/${slug}`} className="block">
        <h2 className="text-2xl md:text-[28px] font-semibold mb-3 group-hover:text-blue-600 transition-colors">
          {metadata.title}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed mb-4 max-w-2xl">
          {metadata.description}
        </p>
        <div className="text-xs font-bold text-blue-600 uppercase flex items-center">
          <span>{metadata.date}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-400">{metadata.readTime}</span>
        </div>
      </Link>
    </div>
  );
}
