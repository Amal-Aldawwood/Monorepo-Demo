// Script to check existing sites in the database
const { PrismaClient } = require('@prisma/client');

async function checkSites() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking sites in the database...');
    
    // Get all sites including inactive ones
    const allSites = await prisma.site.findMany();
    console.log('All sites (including inactive):', allSites);
    
    // Get only active sites
    const activeSites = await prisma.site.findMany({ 
      where: { isActive: true } 
    });
    console.log('Active sites only:', activeSites);
    
    return allSites;
  } catch (error) {
    console.error('Error checking sites:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSites()
  .then(() => {
    console.log('Check completed');
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  });
