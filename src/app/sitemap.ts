import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // Strategy: In later phases, this will dynamically fetch years and entities
  // from Prisma to generate a comprehensive sitemap.
  return [
    {
      url: 'https://timecapsule.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
