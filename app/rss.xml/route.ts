import {getPosts} from "@/libs/mdx";
import {appConfigs, siteUrl} from "@/resources/resources";
import moment from "moment";

export async function GET() {
  const posts = getPosts();
  
  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/${post.slug}`;
      const pubDate = moment(post.metadata.date, 'DD MMM YYYY').toDate().toUTCString();
      
      return `
        <item>
          <title><![CDATA[${post.metadata.title}]]></title>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${post.metadata.description}]]></description>
          ${post.metadata.author ? `<author>${post.metadata.author}</author>` : ""}
        </item>
      `;
    })
    .join("");
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title><![CDATA[${appConfigs["title"]}]]></title>
        <link>${siteUrl}</link>
        <description><![CDATA[${appConfigs.description}]]></description>
        <language>${appConfigs.locale || "en-US"}</language>
        <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${itemsXml}
      </channel>
    </rss>`;
  
  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
