// import express from 'express';
// const router = express.Router();

// import { SitemapStream, streamToPromise } from 'sitemap';
// import { createGzip } from 'zlib';
// import { Readable } from 'stream';
// import dotenv from 'dotenv';

// dotenv.config();

// const PORT = process.env.PORT || 3000;
// const SITE_URL = process.env.SITE_URL || 'https://www.dubaianalytica.com';

// // Function to get dynamic URLs from your database/source
// async function getDynamicUrls() {
//   try {
//     // Example: You would replace this with actual database queries
//     // const surveys = await prisma.survey.findMany();
//     // const users = await prisma.user.findMany();
    
//     // Static URLs
//     const staticUrls = [
//       { url: '/', changefreq: 'daily', priority: 1.0 },
//       {url: '/about', changefreq: 'monthly', priority: 0.8},
//       {url: '/contact', changefreq: 'monthly', priority: 0.8},
//       {url: '/privacy-policy', changefreq: 'monthly', priority: 0.8},
//       {url: '/terms-of-service', changefreq: 'monthly', priority: 0.8},
//       {url: '/pricing', changefreq: 'monthly', priority: 0.8},
//       {url: '/features', changefreq: 'monthly', priority: 0.8},
//     ];

//     // Dynamic URLs (example)
//     const dynamicUrls = [
//       // Example of how to add survey URLs
//       // ...surveys.map(survey => ({
//       //   url: `/user-survey/${survey.id}`,
//       //   changefreq: 'weekly',
//       //   priority: 0.6,
//       //   lastmod: survey.updatedAt.toISOString()
//       // })),
//     ];

//     return [...staticUrls, ...dynamicUrls];
//   } catch (error) {
//     console.error('Error fetching dynamic URLs:', error);
//     return [];
//   }
// }

// // Sitemap route
// router.get('/sitemap.xml', async (req, res) => {
//   try {
//     // Use cached sitemap if available and not expired
//     if (sitemapCache && lastGenerated && (Date.now() - lastGenerated) < CACHE_DURATION) {
//       res.header('Content-Type', 'application/xml');
//       res.header('Content-Encoding', 'gzip');
//       res.send(sitemapCache);
//       return;
//     }

//     // If cache is expired or not available, generate new sitemap
//     // Set headers
//     res.header('Content-Type', 'application/xml');
//     res.header('Content-Encoding', 'gzip');

//     // Create sitemap stream
//     const smStream = new SitemapStream({
//       hostname: SITE_URL
//     });
    
//     // Get all URLs
//     const urls = await getDynamicUrls();
    
//     // Create a gzip transform stream
//     const pipeline = smStream.pipe(createGzip());

//     // Write URLs to stream
//     Readable.from(urls).pipe(smStream);

//     // Handle errors
//     pipeline.on('error', (error) => {
//       console.error('Sitemap generation error:', error);
//       res.status(500).end();
//     });

//     // Pipe the compressed stream to response
//     pipeline.pipe(res).on('error', (error) => {
//       console.error('Error sending sitemap:', error);
//       res.status(500).end();
//     });

//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Cache-related code
// const CACHE_DURATION = 24 * 60 * 60 * 1000;
// let sitemapCache = null;
// let lastGenerated = null;

// async function generateAndCacheSitemap() {
//   try {
//     const urls = await getDynamicUrls();
    
//     // Validate URLs before generating sitemap
//     const validUrls = urls.filter(url => {
//       if (!url.url) return false;
//       if (url.priority && (url.priority < 0 || url.priority > 1)) return false;
//       return true;
//     });

//     const stream = new SitemapStream({ hostname: SITE_URL });
//     const data = await streamToPromise(Readable.from(validUrls).pipe(stream));
//     // sitemapCache = await streamToPromise(data.pipe(createGzip()));
//     lastGenerated = Date.now();
//     console.log('Sitemap cache updated at:', new Date(lastGenerated).toISOString());
//   } catch (error) {
//     console.error('Cache generation error:', error);
//   }
// }

// // Generate initial cache
// generateAndCacheSitemap();

// // Regenerate cache periodically
// setInterval(generateAndCacheSitemap, CACHE_DURATION);

// export default router;
