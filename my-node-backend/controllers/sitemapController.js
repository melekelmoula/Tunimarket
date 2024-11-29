const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const generateSitemap = async (products, categories) => {
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
    ${allUrls.map(url => 
      `<url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
      </url>`).join('')}
  </urlset>`;

  // Use the GitHub API to update the sitemap file
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }); // Make sure to set the GITHUB_TOKEN in your environment variables

  const owner = 'melekelmoula'; // Your GitHub username
  const repo = 'Tunimarket'; // Your repository name
  const pathToFile = 'my-react-app/public/sitemap.xml'; // Path to the file in your repository

  try {
    // Step 1: Get the current SHA of the file to ensure we're updating the right version
    const { data: { sha } } = await octokit.repos.getContent({
      owner,
      repo,
      path: pathToFile,
    });

    console.log('Current SHA of the file:', sha); // Debug: Check if SHA is correct

    // Step 2: Update the file with the new content
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: pathToFile,
      message: 'Update sitemap.xml',
      content: Buffer.from(sitemapXml).toString('base64'), // GitHub API expects base64-encoded content
      sha, // Provide the SHA for the existing file so it can be updated
    });

    console.log('Sitemap generated and pushed to GitHub successfully!', response.data); // Debug: Log the response from GitHub

  } catch (error) {
    console.error('Error updating sitemap on GitHub:', error);

    // Log detailed response from GitHub's error if available
    if (error.response) {
      console.error('Error Response from GitHub:', error.response.data);
    }
  }
};

module.exports = { generateSitemap };
