// Script to test site creation API
const fetch = require('node-fetch');

async function createSiteTest() {
  try {
    console.log('Testing site creation API...');
    const url = 'http://localhost:3007/api/sites';
    
    const siteData = {
      name: "Test Site 5",
      color: "#6366f1",
      port: 3009
    };
    
    console.log(`Connecting to: ${url}`);
    console.log('Sending data:', JSON.stringify(siteData, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create site: ${response.statusText}\n${errorText}`);
    }
    
    const data = await response.json();
    console.log('Creation Response:', JSON.stringify(data, null, 2));
    
    // Now check if we can fetch the sites including the new one
    const sitesResponse = await fetch(url);
    const sitesData = await sitesResponse.json();
    console.log('\nAll sites:', JSON.stringify(sitesData, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error testing site creation:', error);
  }
}

createSiteTest()
  .then(() => {
    console.log('Test completed');
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  });
