import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://syamna-quran.com';

  const routes = [
    '',
    '/quran',
    '/hadits',
    '/jadwal-sholat',
    '/asmaul-husna',
    '/doa',
    '/iqro',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
