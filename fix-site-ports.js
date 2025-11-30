// Script to fix site port numbers in the database
const { PrismaClient } = require('@prisma/client');

async function fixSitePorts() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Fixing site port numbers...');
    
    // Update port numbers for each site
    const portUpdates = [
      { id: 1, port: 3002 },
      { id: 2, port: 3003 },
      { id: 3, port: 3004 },
      { id: 4, port: 3005 }
    ];
    
    for (const update of portUpdates) {
      await prisma.site.update({
        where: { id: update.id },
        data: { port: update.port }
      });
      console.log(`Updated site ID ${update.id} port to ${update.port}`);
    }
    
    // Get all sites to verify the updates
    const allSites = await prisma.site.findMany();
    console.log('Updated sites:', allSites);
    
    return allSites;
  } catch (error) {
    console.error('Error fixing site ports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSitePorts()
  .then(() => {
    console.log('Fix completed');
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  });
