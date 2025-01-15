// server.js
const express = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const fs = require('fs');
const app = express();
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
  // Add more URLs as needed
];

// Middleware to compress the response
app.use((req, res, next) => {
  res.setHeader('Content-Encoding', 'gzip');
  next();
});
    //generate sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');

  try {
    const smStream = new SitemapStream({ hostname: 'https://www.dubaianalytica.com/' });
    const pipeline = smStream.pipe(createGzip());

    urls.forEach((url) => smStream.write(url));
    smStream.end();

    streamToPromise(pipeline).then((sm) =>
      fs.writeFileSync('./public/sitemap.xml', sm)
    );
    pipeline.pipe(res).on('error', (e) => {
      throw e;
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});

//generate for build
app.get('/sitemapgenerate.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');

  try {
    const smStream = new SitemapStream({ hostname: 'https://www.dubaianalytica.com/' });
    const pipeline = smStream.pipe(createGzip());

    urls.forEach((url) => smStream.write(url));
    smStream.end();

    streamToPromise(pipeline).then((sm) =>
      fs.writeFileSync('./public/sitemap.xml', sm)
    );
    pipeline.pipe(res).on('error', (e) => {
      throw e;
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});

app.use((req, res, next) => {
    res.setHeader('Content-Encoding', 'gzip');
    next();
  });
  
  // Route to generate sitemap.xml
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const urls = await getUrls();
      const smStream = new SitemapStream({ hostname: 'https://www.dubaianalytica.com/' });
      const pipeline = smStream.pipe(createGzip());
  
      urls.forEach((url) => smStream.write(url));
      smStream.end();
  
      streamToPromise(pipeline).then((sm) =>
        fs.writeFileSync('./public/sitemap.xml', sm)
      );
  
      pipeline.pipe(res).on('error', (e) => {
        console.error(e);
        res.status(500).end();
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });


  app.use((req, res, next) => {
    res.setHeader('Content-Encoding', 'gzip');
    next();
  });
  
  // Route to generate sitemap.xml
  app.get('/sitemap.xml', async (req, res) => {
    res.header('Content-Type', 'application/xml');
    let smStream;
    try {
      const urls = await getUrls();
      smStream = new SitemapStream({ hostname: 'https://www.dubaianalytica.com/' });
      const pipeline = smStream.pipe(createGzip());
  
      urls.forEach((url) => smStream.write(url));
      smStream.end();
  
      streamToPromise(pipeline)
        .then((sitemap) => {
          try {
            fs.writeFileSync('./public/sitemap.xml', sitemap);
          } catch (error) {
            console.error('Error writing sitemap to file:', error);
            res.status(500).send('Internal Server Error: Could not write sitemap to file');
          }
        })
        .catch((error) => {
          console.error('Error generating sitemap:', error);
          res.status(500).send('Internal Server Error: Could not generate sitemap');
        });
  
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
