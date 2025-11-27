// Script to test profile creation functionality
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

async function testProfileCreation() {
  // For testing with admin route on port 3007
  const BASE_URL = 'http://localhost:3007';
  
  console.log('Testing profile creation without specifying customerId...');
  
  try {
    // Test creating a profile without specifying a customerId
    const response = await fetch('http://localhost:3007/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        age: 30
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ SUCCESS: Profile created successfully!');
    } else {
      console.log('❌ ERROR: Failed to create profile');
    }
  } catch (error) {
    console.error('Error testing profile creation:', error);
  }
}

testProfileCreation();
