import { Course, CourseEnrollment, CourseModule } from '../types/Course';
import coursesData from '../data/courses.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  await delay(300);
  return coursesData.map(course => ({
    ...course,
    created_at: course.created_at ? new Date(course.created_at) : undefined
  })) as Course[];
};

// Get course by ID
export const getCourseById = async (id: string): Promise<Course | undefined> => {
  await delay(200);
  const course = coursesData.find(course => course.id === id);
  if (!course) return undefined;
  
  return {
    ...course,
    created_at: course.created_at ? new Date(course.created_at) : undefined
  } as Course;
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  await delay(250);
  const filteredCourses = coursesData.filter(course => 
    course.category.toLowerCase() === category.toLowerCase()
  );
  
  return filteredCourses.map(course => ({
    ...course,
    created_at: course.created_at ? new Date(course.created_at) : undefined
  })) as Course[];
};

// Get courses by instructor
export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
  await delay(250);
  const filteredCourses = coursesData.filter(course => course.created_by === instructorId);
  
  return filteredCourses.map(course => ({
    ...course,
    created_at: course.created_at ? new Date(course.created_at) : undefined
  })) as Course[];
};

// Search courses
export const searchCourses = async (query: string): Promise<Course[]> => {
  await delay(300);
  const searchTerm = query.toLowerCase();
  const filteredCourses = coursesData.filter(course => 
    course.title.toLowerCase().includes(searchTerm) ||
    course.description.toLowerCase().includes(searchTerm) ||
    course.category.toLowerCase().includes(searchTerm) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  
  return filteredCourses.map(course => ({
    ...course,
    created_at: course.created_at ? new Date(course.created_at) : undefined
  })) as Course[];
};

// Create a new course (for tutors)
export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'enrollment_count' | 'average_rating' | 'total_ratings'>): Promise<Course> => {
  await delay(500);
  
  const newCourse: Course = {
    id: (coursesData.length + 1).toString(),
    ...courseData,
    enrollment_count: 0,
    average_rating: 0,
    total_ratings: 0,
    created_at: new Date(),
  };
  
  // In a real app, we would save the course to a database here
  return newCourse;
};

// Update a course
export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course | null> => {
  await delay(500);
  
  const courseIndex = coursesData.findIndex(course => course.id === id);
  if (courseIndex === -1) {
    return null;
  }
  
  const updatedCourse = {
    ...coursesData[courseIndex],
    ...courseData,
    updated_at: new Date(),
  };
  
  // In a real app, we would update the course in the database here
  return updatedCourse as Course;
};

// Delete a course
export const deleteCourse = async (id: string): Promise<boolean> => {
  await delay(300);
  
  const courseIndex = coursesData.findIndex(course => course.id === id);
  if (courseIndex === -1) {
    return false;
  }
  
  // In a real app, we would delete the course from the database here
  return true;
};

// Enroll in a course
export const enrollInCourse = async (courseId: string, userId: string): Promise<CourseEnrollment> => {
  await delay(400);
  
  const enrollment: CourseEnrollment = {
    id: `enrollment_${Date.now()}`,
    course_id: courseId,
    user_id: userId,
    enrolled_at: new Date(),
    progress: 0,
    last_accessed: new Date()
  };
  
  // In a real app, we would save the enrollment to a database here
  return enrollment;
};

// Get user enrollments
export const getUserEnrollments = async (userId: string): Promise<CourseEnrollment[]> => {
  await delay(300);
  
  // Mock data - in a real app, this would come from a database
  return [
    {
      id: "enrollment_1",
      course_id: "1",
      user_id: userId,
      enrolled_at: new Date("2024-02-15"),
      progress: 75,
      last_accessed: new Date("2024-02-28")
    },
    {
      id: "enrollment_2",
      course_id: "2",
      user_id: userId,
      enrolled_at: new Date("2024-02-20"),
      progress: 45,
      last_accessed: new Date("2024-02-27")
    }
  ];
};

// Get featured courses
export const getFeaturedCourses = async (): Promise<Course[]> => {
  await delay(250);
  
  // Return courses with highest ratings
  const sortedCourses = coursesData
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, 6);
  
  return sortedCourses.map(course => ({
    ...course,
    created_at: course.created_at ? new Date(course.created_at) : undefined
  })) as Course[];
};
