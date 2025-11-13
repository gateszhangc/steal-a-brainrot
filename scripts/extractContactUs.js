import fs from 'fs';
import { JSDOM } from 'jsdom';

// Read the HTML file
const html = fs.readFileSync('contact-us-source.html', 'utf8');

// Fix HTML if it starts with UTF-8 BOM or has issues
let cleanHtml = html;
if (cleanHtml.startsWith('﻿')) {
  cleanHtml = cleanHtml.substring(1);
}

// Parse the HTML
const dom = new JSDOM(cleanHtml);
const document = dom.window.document;

// Extract head content (excluding title)
const head = document.head.innerHTML;
const titleMatch = cleanHtml.match(/<title>(.*?)<\/title>/);
const title = titleMatch ? titleMatch[1] : 'Contact Us - Steal Brainrot';

// Extract body content
const body = document.body.innerHTML;

// Create data directory if it doesn't exist
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Write head content to file
let headContent = head;
// Remove the title tag since Next.js will handle it
headContent = headContent.replace(/<title>.*?<\/title>/, '');
// Remove the canonical link since Next.js will handle it
headContent = headContent.replace(/<link[^>]*rel=["']canonical["'][^>]*>/, '');

fs.writeFileSync('./data/contact-us-head.html', headContent);

// Write body content to file
fs.writeFileSync('./data/contact-us-body.html', body);

console.log('Extracted head and body content for contact-us page');
console.log('Title:', title);
console.log('Head length:', headContent.length);
console.log('Body length:', body.length);