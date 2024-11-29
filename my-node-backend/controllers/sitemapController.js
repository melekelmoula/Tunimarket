const fs = require('fs');
const path = require('path');

const generateSitemap = (products, categories) => {
  // Generate the URLs for the products and categories
  const productUrls = products.map(product => ({
    loc: `https://tunimarket.vercel.app/product/${product.id}`,
    lastmod: new Date().toISOString(),
  }));

  const categoryUrls = categories.map(category => ({
    loc: `https://tunimarket.vercel.app/category/${category.name}`,
    lastmod: new Date().toISOString(),
  }));

  // Combine the URLs
  const allUrls = [
    { loc: 'https://tunimarket.vercel.app/', lastmod: new Date().toISOString() }, // Home page URL
    ...productUrls,
    ...categoryUrls
  ];

  // Generate the XML structure for the sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls.map(url => `
      <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
      </url>
    `).join('')}
  </urlset>`;

  // Save the sitemap to the public directory in the my-react-app folder
  const sitemapPath = path.resolve('../my-react-app/public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

  console.log('Sitemap generated successfully');
};

module.exports = { generateSitemap };
