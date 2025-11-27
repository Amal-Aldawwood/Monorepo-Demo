import { db } from '../index';

// Define types based on the Prisma schema
export interface Profile {
  id: number;
  name: string;
  age: number;
  customerId: number;
  sharedWith: string | null; // JSON string of site IDs
  createdAt: Date;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  siteId: number; // 1, 2, or 3
  color: string; // Brand color
  createdAt: Date;
  profiles: Profile[];
}

/**
 * Get all customers
 */
export const getAllCustomers = async (): Promise<Customer[]> => {
  return db.customer.findMany({
    include: {
      profiles: true
    }
  });
};

/**
 * Get a customer by ID
 */
export const getCustomerById = async (id: number): Promise<Customer | null> => {
  return db.customer.findUnique({
    where: { id },
    include: {
      profiles: true
    }
  });
};

/**
 * Get customers by site ID
 */
export const getCustomersBySiteId = async (siteId: number): Promise<Customer[]> => {
  return db.customer.findMany({
    where: { siteId },
    include: {
      profiles: true
    }
  });
};

/**
 * Create a new customer
 */
export const createCustomer = async (data: {
  name: string;
  email: string;
  siteId: number;
  color: string;
}): Promise<Customer> => {
  return db.customer.create({
    data,
    include: {
      profiles: true
    }
  });
};

/**
 * Update an existing customer
 */
export const updateCustomer = async (
  id: number,
  data: Partial<{
    name: string;
    email: string;
    siteId: number;
    color: string;
  }>
): Promise<Customer | null> => {
  return db.customer.update({
    where: { id },
    data,
    include: {
      profiles: true
    }
  });
};

/**
 * Delete a customer by ID
 */
export const deleteCustomer = async (id: number): Promise<Customer | null> => {
  return db.customer.delete({
    where: { id },
    include: {
      profiles: true
    }
  });
};
