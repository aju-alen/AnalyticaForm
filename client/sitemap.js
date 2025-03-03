// server.js
const express = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const fs = require('fs');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Define your website URLs here
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
  // Add more URLs as needed
];

// Single middleware declaration for compression
app.use((req, res, next) => {
  res.setHeader('Content-Encoding', 'gzip');
  next();
});

// Single route to generate and serve sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');
  let smStream;

  try {
    smStream = new SitemapStream({ hostname: 'https://www.dubaianalytica.com' });
    const pipeline = smStream.pipe(createGzip());

    // Write URLs to sitemap
    urls.forEach((url) => smStream.write(url));
    smStream.end();

    // Save sitemap to file and serve it
    const sitemap = await streamToPromise(pipeline);
    
    try {
      fs.writeFileSync('./public/sitemap.xml', sitemap);
    } catch (error) {
      console.error('Error writing sitemap to file:', error);
    }

    pipeline.pipe(res).on('error', (error) => {
      console.error('Error in pipeline:', error);
      res.status(500).send('Internal Server Error');
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Internal Server Error: Could not generate sitemap');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
