import {MetadataRoute} from "next";

import moment from "moment";
import {appConfigs, siteUrl} from "@/resources/resources";
import {getPosts} from "@/libs/mdx";

moment.locale(appConfigs.locale);
const lastModified = moment().format(appConfigs["datetime-format"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPosts();
  
  const postsUrls: MetadataRoute.Sitemap = posts.map((post) => {
    let postDate = lastModified;
    
    if (post.metadata.date) {
      const parsedDate = moment(post.metadata.date, 'DD MMM YYYY', 'pt-br', true);
      if (parsedDate.isValid()) {
        postDate = parsedDate.format(appConfigs["datetime-format"]);
      } else {
        const fallbackDate = moment(post.metadata.date);
        if(fallbackDate.isValid()){
          postDate = fallbackDate.format(appConfigs["datetime-format"]);
        }
      }
    }
    
    return {
      url: `${siteUrl}/${post.slug}`,
      lastModified: postDate,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });
  
  return [
    {
      url: siteUrl,
      lastModified: lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: lastModified,
    },
    ...postsUrls,
  ];
}
