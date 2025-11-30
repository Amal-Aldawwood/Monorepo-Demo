const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generate a new site based on the provided ID, name, and port
 * 
 * Usage: 
 * node scripts/generate-site.js <siteId> <siteName> <port>
 * 
 * Example:
 * node scripts/generate-site.js 5 "Site 5" 3006
 */

// Validate arguments
const siteId = process.argv[2];
const siteName = process.argv[3];
const port = process.argv[4] || 3000 + parseInt(siteId, 10);

if (!siteId || !siteName) {
  console.error('Error: Site ID and name are required!');
  console.log('Usage: node scripts/generate-site.js <siteId> <siteName> [port]');
  process.exit(1);
}

// Get the root directory
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');

// Template site to use for copying
const templateSiteDir = path.join(appsDir, 'site1');
const newSiteDir = path.join(appsDir, `site${siteId}`);

console.log(`Generating new site: ${siteName} (ID: ${siteId}) on port ${port}...`);

// Create the site directory if it doesn't exist
if (!fs.existsSync(newSiteDir)) {
  console.log(`Creating directory: ${newSiteDir}`);
  fs.mkdirSync(newSiteDir, { recursive: true });

  // Create app directory structure
  fs.mkdirSync(path.join(newSiteDir, 'app'), { recursive: true });
  fs.mkdirSync(path.join(newSiteDir, 'app', 'api'), { recursive: true });
  fs.mkdirSync(path.join(newSiteDir, 'app', 'api', 'profiles'), { recursive: true });
} else {
  console.log(`Directory already exists: ${newSiteDir}`);
}

// Helper function to copy and modify a file
function copyAndModifyFile(sourceFile, destFile, replacements) {
  console.log(`Copying file: ${path.relative(rootDir, sourceFile)} -> ${path.relative(rootDir, destFile)}`);
  
  let content = fs.readFileSync(sourceFile, 'utf8');
  
  // Apply replacements
  Object.keys(replacements).forEach(key => {
    content = content.replace(new RegExp(key, 'g'), replacements[key]);
  });
  
  fs.writeFileSync(destFile, content);
}

// For package.json, let's use a more direct approach to ensure ports are correctly set
const templatePackageJson = JSON.parse(fs.readFileSync(path.join(templateSiteDir, 'package.json'), 'utf8'));
const newPackageJson = { ...templatePackageJson };

// Update the package details
newPackageJson.name = `site${siteId}`;
if (newPackageJson.dependencies && newPackageJson.dependencies['@repo/site1']) {
  newPackageJson.dependencies['@repo/site' + siteId] = newPackageJson.dependencies['@repo/site1'];
  delete newPackageJson.dependencies['@repo/site1'];
}

// Set the correct ports
if (newPackageJson.scripts) {
  if (newPackageJson.scripts.dev) {
    newPackageJson.scripts.dev = `next dev -p ${port}`;
  }
  if (newPackageJson.scripts.start) {
    newPackageJson.scripts.start = `next start -p ${port}`;
  }
}

// Write the new package.json
fs.writeFileSync(
  path.join(newSiteDir, 'package.json'),
  JSON.stringify(newPackageJson, null, 2) + '\n'
);
console.log(`Copying file: ${path.relative(rootDir, path.join(templateSiteDir, 'package.json'))} -> ${path.relative(rootDir, path.join(newSiteDir, 'package.json'))}`);

// Copy and modify next.config.js
copyAndModifyFile(
  path.join(templateSiteDir, 'next.config.js'),
  path.join(newSiteDir, 'next.config.js'),
  {}
);

// Copy and modify tsconfig.json
copyAndModifyFile(
  path.join(templateSiteDir, 'tsconfig.json'),
  path.join(newSiteDir, 'tsconfig.json'),
  {}
);

// Copy and modify tailwind.config.js
copyAndModifyFile(
  path.join(templateSiteDir, 'tailwind.config.js'),
  path.join(newSiteDir, 'tailwind.config.js'),
  {}
);

// Copy and modify postcss.config.js
copyAndModifyFile(
  path.join(templateSiteDir, 'postcss.config.js'),
  path.join(newSiteDir, 'postcss.config.js'),
  {}
);

// Copy and modify app files
const appFiles = [
  'globals.css',
  'layout.tsx',
  'page.tsx',
  'not-found.tsx'
];

appFiles.forEach(file => {
  copyAndModifyFile(
    path.join(templateSiteDir, 'app', file),
    path.join(newSiteDir, 'app', file),
    {
      'Site 1': `${siteName}`
    }
  );
});

// Copy and modify API files
copyAndModifyFile(
  path.join(templateSiteDir, 'app', 'api', 'profiles', 'route.ts'),
  path.join(newSiteDir, 'app', 'api', 'profiles', 'route.ts'),
  {}
);

// Update the root package.json to add the dev script for the new site
const rootPackageJsonPath = path.join(rootDir, 'package.json');
let rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));

// Add the dev script for the new site
const devScriptKey = `dev:site${siteId}`;
const devScriptValue = `npm run dev --workspace=apps/site${siteId}`;
rootPackageJson.scripts[devScriptKey] = devScriptValue;

// Write the updated package.json back to disk
fs.writeFileSync(
  rootPackageJsonPath,
  JSON.stringify(rootPackageJson, null, 2) + '\n'
);

console.log(`Site ${siteName} (ID: ${siteId}) has been generated successfully!`);
console.log(`Port: ${port}`);
console.log('\nNext steps:');
console.log('1. The site has been added to your root package.json scripts');
console.log(`2. Run: npm run dev:site${siteId}`);
console.log('3. Visit: http://localhost:' + port);
