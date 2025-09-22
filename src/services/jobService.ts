import { Job } from '../types/Job';
import jobsData from '../data/jobs.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  await delay(300); // Simulate network delay
  // Convert string dates to Date objects
  return jobsData.map(job => ({
    ...job,
    created_at: job.created_at ? new Date(job.created_at) : undefined
  })) as Job[];
};

// Get job by ID
export const getJobById = async (id: string): Promise<Job | undefined> => {
  await delay(200); // Simulate network delay
  const job = jobsData.find(job => job.id === id);
  if (!job) return undefined;
  
  // Convert string dates to Date objects
  return {
    ...job,
    created_at: job.created_at ? new Date(job.created_at) : undefined
  } as Job;
};

// Create a new job
export const createJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> => {
  await delay(500); // Simulate network delay
  
  const newJob: Job = {
    id: (jobsData.length + 1).toString(),
    ...jobData,
    created_at: new Date(),
  };
  
  // In a real app, we would save the job to a database here
  // For now, we'll just return the new job
  return newJob;
};

// Update a job
export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job | null> => {
  await delay(500); // Simulate network delay
  
  const jobIndex = jobsData.findIndex(job => job.id === id);
  if (jobIndex === -1) {
    return null;
  }
  
  const updatedJob = {
    ...jobsData[jobIndex],
    ...jobData,
    updated_at: new Date(),
  };
  
  // In a real app, we would update the job in the database here
  // For now, we'll just return the updated job
  return updatedJob as Job;
};

// Delete a job
export const deleteJob = async (id: string): Promise<boolean> => {
  await delay(300); // Simulate network delay
  
  const jobIndex = jobsData.findIndex(job => job.id === id);
  if (jobIndex === -1) {
    return false;
  }
  
  // In a real app, we would delete the job from the database here
  // For now, we'll just return true
  return true;
};