import {MetadataRoute} from "next";

import moment from "moment";
import {appConfigs, siteUrl} from "@/resources/resources";
import {getPosts} from "@/libs/mdx";

moment.locale(appConfigs.locale);
const lastModified = moment().format(appConfigs["datetime-format"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPosts();

  const postsUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const postDate = post.metadata.date 
      ? moment(post.metadata.date, 'DD MMM YYYY').format(appConfigs["datetime-format"])
      : lastModified;

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
