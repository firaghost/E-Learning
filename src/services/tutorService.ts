import { Tutor } from '../types/Tutor';
import { ApiAdapter, DemoDataStore } from './apiAdapter';
import { isDemo } from '../config/environment';
import tutorsData from '../data/tutors.json';

// Convert JSON data to Tutor objects with proper Date objects
const demoTutors: Tutor[] = tutorsData.map(tutor => ({
  ...tutor,
  created_at: tutor.created_at ? new Date(tutor.created_at) : undefined,
  updated_at: undefined, // Add this field since it doesn't exist in JSON
}));

// Initialize demo data
if (isDemo()) {
  const storedTutors = DemoDataStore.get('tutors', demoTutors);
  if (storedTutors.length === 0) {
    DemoDataStore.set('tutors', demoTutors);
  }
}

export const getAllTutors = async (): Promise<Tutor[]> => {
  if (isDemo()) {
    return DemoDataStore.get('tutors', demoTutors);
  }

  return ApiAdapter.get<Tutor[]>('/tutors');
};

export const getTutorById = async (id: string): Promise<Tutor | null> => {
  if (isDemo()) {
    const tutors = DemoDataStore.get('tutors', demoTutors);
    return tutors.find((tutor: Tutor) => tutor.id === id) || null;
  }

  try {
    return await ApiAdapter.get<Tutor>(`/tutors/${id}`);
  } catch (error) {
    return null;
  }
};

export const createTutor = async (tutorData: Omit<Tutor, 'id' | 'created_at' | 'updated_at'>): Promise<Tutor> => {
  if (isDemo()) {
    const tutors = DemoDataStore.get('tutors', demoTutors);
    const newTutor: Tutor = {
      ...tutorData,
      id: `demo_tutor_${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    tutors.push(newTutor);
    DemoDataStore.set('tutors', tutors);
    return newTutor;
  }

  return ApiAdapter.authenticatedRequest<Tutor>('/tutors', {
    method: 'POST',
    body: JSON.stringify(tutorData)
  });
};

export const updateTutor = async (id: string, updates: Partial<Tutor>): Promise<Tutor | null> => {
  if (isDemo()) {
    const tutors = DemoDataStore.get('tutors', demoTutors);
    const tutorIndex = tutors.findIndex((tutor: Tutor) => tutor.id === id);
    
    if (tutorIndex === -1) {
      return null;
    }
    
    tutors[tutorIndex] = {
      ...tutors[tutorIndex],
      ...updates,
      updated_at: new Date(),
    };
    
    DemoDataStore.set('tutors', tutors);
    return tutors[tutorIndex];
  }

  try {
    return await ApiAdapter.authenticatedRequest<Tutor>(`/tutors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    return null;
  }
};

export const deleteTutor = async (id: string): Promise<boolean> => {
  if (isDemo()) {
    const tutors = DemoDataStore.get('tutors', demoTutors);
    const tutorIndex = tutors.findIndex((tutor: Tutor) => tutor.id === id);
    
    if (tutorIndex === -1) {
      return false;
    }
    
    tutors.splice(tutorIndex, 1);
    DemoDataStore.set('tutors', tutors);
    return true;
  }

  try {
    await ApiAdapter.authenticatedRequest(`/tutors/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getTutorsBySubject = async (subject: string): Promise<Tutor[]> => {
  if (isDemo()) {
    const tutors = DemoDataStore.get('tutors', demoTutors);
    return tutors.filter((tutor: Tutor) => 
      tutor.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  return ApiAdapter.get<Tutor[]>(`/tutors?subject=${encodeURIComponent(subject)}`);
};

export const searchTutors = async (query: string): Promise<Tutor[]> => {
  if (isDemo()) {
    const tutors = DemoDataStore.get('tutors', demoTutors);
    const lowercaseQuery = query.toLowerCase();
    return tutors.filter((tutor: Tutor) => 
      tutor.name.toLowerCase().includes(lowercaseQuery) ||
      tutor.subject.toLowerCase().includes(lowercaseQuery) ||
      tutor.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  return ApiAdapter.get<Tutor[]>(`/tutors/search?q=${encodeURIComponent(query)}`);
};