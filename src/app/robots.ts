import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/inbox', '/profile/edit'],
    },
    sitemap: 'https://monerjone.com/sitemap.xml',
  };
}
