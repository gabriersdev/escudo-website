import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostMetadata = {
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: string;
  image?: string;
  featured?: boolean;
  topic?: string;
};

export type PostData = {
  metadata: PostMetadata;
  slug: string;
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), 'app', 'posts');

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

export function readMDXFile(filePath: string): PostData | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(rawContent);

  const slug = path.basename(filePath, path.extname(filePath));

  const metadata: PostMetadata = {
    title: data.title || '',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'The Journal',
    readTime: data.readTime || '1 MIN READ',
    image: data.image || '',
    featured: data.featured || false,
    topic: data.topic || 'General',
  };

  return { metadata, content, slug };
}

export function getPosts(): PostData[] {
  const mdxFiles = getMDXFiles(POSTS_DIR);
  const posts = mdxFiles
    .map((file) => readMDXFile(path.join(POSTS_DIR, file)))
    .filter((post): post is PostData => post !== null);
  
  // Sort posts by date descending
  return posts.sort((a, b) => {
    return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
  });
}

export function getPostBySlug(slug: string): PostData | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  return readMDXFile(filePath);
}

export function getTopics() {
  const posts = getPosts();
  const topicsMap: Record<string, number> = {};
  
  posts.forEach((post) => {
    const topic = post.metadata.topic || 'General';
    if (!topicsMap[topic]) {
      topicsMap[topic] = 0;
    }
    topicsMap[topic]++;
  });

  return Object.entries(topicsMap).map(([name, count]) => ({
    name,
    count,
  }));
}
