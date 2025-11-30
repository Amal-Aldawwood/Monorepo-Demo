// Script to test site constants initialization
const fetch = require('node-fetch');

async function testSiteConstants() {
  try {
    console.log('Testing site constants initialization...');
    
    // Call the initialization endpoint
    const response = await fetch('http://localhost:3007/api/init');
    
    if (!response.ok) {
      throw new Error(`Failed to initialize site constants: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // If initialization was successful, make other requests to test integration
    if (data.success) {
      console.log('\nTesting site list API...');
      const sitesResponse = await fetch('http://localhost:3007/api/sites');
      const sitesData = await sitesResponse.json();
      console.log('Sites API Response:', JSON.stringify(sitesData, null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('Error testing site constants:', error);
  }
}

testSiteConstants()
  .then(() => {
    console.log('Test completed');
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  });
