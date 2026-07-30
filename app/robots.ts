import type {MetadataRoute} from 'next'
import {siteUrl} from "@/resources/resources";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/ei',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
