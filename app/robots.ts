import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://syamna-quran.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/'], // Melindungi endpoint API dan Auth dari indexing
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
