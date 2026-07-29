const fs = require('fs');
const path = require('path');
const glob = require('glob');

// This script will remove all mock data arrays/objects from the mock-data.ts files
// leaving only the interface/type declarations intact.

const files = glob.sync('f:/AI-powered Project Management SaaS application/features/**/mock*.ts');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/export const mock\w+\s*(:\s*[\w\[\]]+)?\s*=\s*\[[\s\S]*?\];/g, 'export const mockDataRemoved = [];');
  content = content.replace(/export const mock\w+\s*(:\s*[\w\[\]]+)?\s*=\s*\{[\s\S]*?\};/g, 'export const mockDataRemoved = {};');
  fs.writeFileSync(file, content);
  console.log('Cleaned ' + file);
});
