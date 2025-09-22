import { Tutor } from '../types/Tutor';
import tutorsData from '../data/tutors.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all tutors
export const getAllTutors = async (): Promise<Tutor[]> => {
  await delay(300); // Simulate network delay
  // Convert string dates to Date objects
  return tutorsData.map(tutor => ({
    ...tutor,
    created_at: tutor.created_at ? new Date(tutor.created_at) : undefined
  })) as Tutor[];
};

// Get tutor by ID
export const getTutorById = async (id: string): Promise<Tutor | undefined> => {
  await delay(200); // Simulate network delay
  const tutor = tutorsData.find(tutor => tutor.id === id);
  if (!tutor) return undefined;
  
  // Convert string dates to Date objects
  return {
    ...tutor,
    created_at: tutor.created_at ? new Date(tutor.created_at) : undefined
  } as Tutor;
};

// Create a new tutor
export const createTutor = async (tutorData: Omit<Tutor, 'id' | 'created_at' | 'updated_at'>): Promise<Tutor> => {
  await delay(500); // Simulate network delay
  
  const newTutor: Tutor = {
    id: (tutorsData.length + 1).toString(),
    ...tutorData,
    created_at: new Date(),
  };
  
  // In a real app, we would save the tutor to a database here
  // For now, we'll just return the new tutor
  return newTutor;
};

// Update a tutor
export const updateTutor = async (id: string, tutorData: Partial<Tutor>): Promise<Tutor | null> => {
  await delay(500); // Simulate network delay
  
  const tutorIndex = tutorsData.findIndex(tutor => tutor.id === id);
  if (tutorIndex === -1) {
    return null;
  }
  
  const updatedTutor = {
    ...tutorsData[tutorIndex],
    ...tutorData,
    updated_at: new Date(),
  };
  
  // In a real app, we would update the tutor in the database here
  // For now, we'll just return the updated tutor
  return updatedTutor as Tutor;
};

// Delete a tutor
export const deleteTutor = async (id: string): Promise<boolean> => {
  await delay(300); // Simulate network delay
  
  const tutorIndex = tutorsData.findIndex(tutor => tutor.id === id);
  if (tutorIndex === -1) {
    return false;
  }
  
  // In a real app, we would delete the tutor from the database here
  // For now, we'll just return true
  return true;
};