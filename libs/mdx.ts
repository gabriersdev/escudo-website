import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import moment from 'moment';
import 'moment/locale/pt-br';
import {appConfigs} from '@/resources/resources';
import {dictionary} from '@/resources/dictionary';

export type PostMetadata = {
  title: string;
  description: string;
  date: string;
  author?: string;
  authors?: string[];
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
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

export function transformMdxContent(content: string): string {
  // Substitui as barras (/) pelo span com fonte Arial, ignorando:
  // 1. Tags HTML/Componentes JSX (<...>)
  // 2. Links Markdown ([...](...))
  // 3. URLs completas (http://... ou https://...)
  return content.replace(
    /(<[^>]+>)|(\[[^\]]+\]\([^)]+\))|(https?:\/\/[^\s]+)|(\/)/g,
    (match, htmlTag, mdLink, url, slash) => {
      if (slash) {
        return `<span style={{ fontSize: "inherit", fontFamily: "Arial, sans-serif" }}>/</span>`;
      }
      return match;
    }
  );
}

export function readMDXFile(filePath: string): PostData | null {
  if (!fs.existsSync(filePath)) return null;
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const {data, content} = matter(rawContent);
  
  const slug = path.basename(filePath, path.extname(filePath));
  
  const wordCount = content.trim().split(/\s+/).length;
  const time = Math.max(1, Math.ceil(wordCount / 200));
  const autoReadTime = dictionary.post.readingTime.replace('{{time}}', time.toString());
  
  const authorRaw = data.author || 'The Journal';
  const authors = authorRaw.split(',').map((a: string) => a.trim());
  
  const metadata: PostMetadata = {
    title: data.title || '',
    description: data.description || '',
    date: data.date || moment().toISOString(),
    author: authorRaw,
    authors: authors,
    readTime: data.readTime || autoReadTime,
    image: data.image || '',
    featured: data.featured || false,
    topic: data.topic || 'General',
  };
  
  const transformedContent = transformMdxContent(content);
  
  return {metadata, content: transformedContent, slug};
}

export function getPosts(): PostData[] {
  const mdxFiles = getMDXFiles(POSTS_DIR);
  const posts = mdxFiles
    .map((file) => readMDXFile(path.join(POSTS_DIR, file)))
    .filter((post): post is PostData => post !== null);
  
  // Sort posts by date descending and don't return posts with future dates
  moment.locale(appConfigs.locale.toLowerCase());
  return posts
    .sort((a, b) => {
      const dateA = moment(a.metadata.date, ['DD MMM YYYY', moment.ISO_8601], 'pt-br');
      const dateB = moment(b.metadata.date, ['DD MMM YYYY', moment.ISO_8601], 'pt-br');
      return dateB.valueOf() - dateA.valueOf();
    })
    .filter((post: PostData) => {
      const postDate = moment(post.metadata.date, ['DD MMM YYYY', moment.ISO_8601], 'pt-br');
      return postDate.isValid() && postDate.isSameOrBefore(moment());
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
    const firstCapitalize = (str: string) => str.at(0)?.toUpperCase() + str.slice(1);
    const topic = firstCapitalize(`${post.metadata.topic || 'General'}`);
    if (!topicsMap[topic]) topicsMap[topic] = 0;
    topicsMap[topic]++;
  });
  
  return Object.entries(topicsMap).map(([name, count]) => ({
    name,
    count,
  }));
}
