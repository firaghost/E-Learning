import { Resource } from '../types/Resource';
import resourcesData from '../data/resources.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all resources
export const getAllResources = async (): Promise<Resource[]> => {
  await delay(300); // Simulate network delay
  // Convert string dates to Date objects
  return resourcesData.map(resource => ({
    ...resource,
    created_at: resource.created_at ? new Date(resource.created_at) : undefined
  })) as Resource[];
};

// Get resource by ID
export const getResourceById = async (id: string): Promise<Resource | undefined> => {
  await delay(200); // Simulate network delay
  const resource = resourcesData.find(resource => resource.id === id);
  if (!resource) return undefined;
  
  // Convert string dates to Date objects
  return {
    ...resource,
    created_at: resource.created_at ? new Date(resource.created_at) : undefined
  } as Resource;
};

// Create a new resource
export const createResource = async (resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource> => {
  await delay(500); // Simulate network delay
  
  const newResource: Resource = {
    id: (resourcesData.length + 1).toString(),
    ...resourceData,
    created_at: new Date(),
  };
  
  // In a real app, we would save the resource to a database here
  // For now, we'll just return the new resource
  return newResource;
};

// Update a resource
export const updateResource = async (id: string, resourceData: Partial<Resource>): Promise<Resource | null> => {
  await delay(500); // Simulate network delay
  
  const resourceIndex = resourcesData.findIndex(resource => resource.id === id);
  if (resourceIndex === -1) {
    return null;
  }
  
  const updatedResource = {
    ...resourcesData[resourceIndex],
    ...resourceData,
    updated_at: new Date(),
  };
  
  // In a real app, we would update the resource in the database here
  // For now, we'll just return the updated resource
  return updatedResource as Resource;
};

// Delete a resource
export const deleteResource = async (id: string): Promise<boolean> => {
  await delay(300); // Simulate network delay
  
  const resourceIndex = resourcesData.findIndex(resource => resource.id === id);
  if (resourceIndex === -1) {
    return false;
  }
  
  // In a real app, we would delete the resource from the database here
  // For now, we'll just return true
  return true;
};