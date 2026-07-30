import {Sidebar} from '@/components/sidebar';
import {getPosts, getTopics} from '@/libs/mdx';

type AppSidebarProps = {
  hideAbout?: boolean;
  excludeSlug?: string;
};

export function AppSidebar({hideAbout, excludeSlug}: AppSidebarProps) {
  const posts = getPosts();
  const topics = getTopics();
  
  let featurePosts = posts;
  if (excludeSlug) {
    featurePosts = posts.filter(p => p.slug !== excludeSlug);
  }
  
  const features = featurePosts.slice(0, 4).map(p => ({
    title: p.metadata.title,
    description: p.metadata.description,
    date: p.metadata.date,
    readTime: p.metadata.readTime,
    slug: p.slug
  }));
  
  return <Sidebar hideAbout={hideAbout} features={features} topics={topics}/>;
}
