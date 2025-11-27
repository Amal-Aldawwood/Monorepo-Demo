import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.profile.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.site.deleteMany();

  // Create sites first
  console.log('Creating sites...');
  const site1 = await prisma.site.create({
    data: {
      id: 1, // Force ID to maintain compatibility
      name: 'Site 1',
      color: '#10b981', // Green
    },
  });

  const site2 = await prisma.site.create({
    data: {
      id: 2, // Force ID to maintain compatibility
      name: 'Site 2',
      color: '#f59e0b', // Orange
    },
  });

  const site3 = await prisma.site.create({
    data: {
      id: 3, // Force ID to maintain compatibility
      name: 'Site 3', 
      color: '#8b5cf6', // Purple
    },
  });

  console.log('Sites created successfully');

  // Create customers for each site
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Tech Company',
      email: 'tech@example.com',
      siteId: 1,
      color: '#10b981', // Green
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Design Studio',
      email: 'design@example.com',
      siteId: 2,
      color: '#f59e0b', // Orange
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Marketing Agency',
      email: 'marketing@example.com',
      siteId: 3,
      color: '#8b5cf6', // Purple
    },
  });

  // Create profiles for customer 1 with sharing
  await prisma.profile.create({
    data: {
      name: 'John Doe',
      age: 28,
      customerId: customer1.id,
      sharedWith: JSON.stringify([2, 3]), // Shared with Site 2 and 3
    },
  });

  await prisma.profile.create({
    data: {
      name: 'Sarah Smith',
      age: 34,
      customerId: customer1.id,
      sharedWith: JSON.stringify([2]), // Shared with Site 2 only
    },
  });

  // Create profiles for customer 2 with sharing
  await prisma.profile.create({
    data: {
      name: 'Michael Johnson',
      age: 42,
      customerId: customer2.id,
      sharedWith: JSON.stringify([1, 3]), // Shared with Site 1 and 3
    },
  });

  // Create profiles for customer 3 with sharing
  await prisma.profile.create({
    data: {
      name: 'Emily Brown',
      age: 25,
      customerId: customer3.id,
      sharedWith: JSON.stringify([1]), // Shared with Site 1 only
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
