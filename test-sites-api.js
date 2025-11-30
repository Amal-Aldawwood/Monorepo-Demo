// Script to directly test the sites API
const fetch = require('node-fetch');

async function testSitesApi() {
  try {
    console.log('Testing sites API connection...');
    const url = 'http://localhost:3007/api/sites';
    
    console.log(`Connecting to: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sites: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Sites API Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error testing sites API:', error);
  }
}

testSitesApi()
  .then(() => {
    console.log('Test completed');
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  });
