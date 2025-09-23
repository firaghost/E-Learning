import { Course } from '../types/Course';
import { ApiAdapter, DemoDataStore } from './apiAdapter';
import { isDemo } from '../config/environment';
import { getBulkEnrollmentCounts, enrollInCourse as enrollmentServiceEnroll } from './enrollmentService';
import { getCourseRatingStats } from './reviewService';
import coursesData from '../data/courses.json';

// Convert JSON data to Course objects with proper Date objects
const demoCourses: Course[] = coursesData.map(course => ({
  ...course,
  difficulty_level: course.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced',
  created_at: course.created_at ? new Date(course.created_at) : undefined,
  updated_at: undefined, // Add this field since it doesn't exist in JSON
}));

// Initialize demo data
if (isDemo()) {
  const storedCourses = DemoDataStore.get('courses', demoCourses);
  if (storedCourses.length === 0) {
    DemoDataStore.set('courses', demoCourses);
  }
}

// Helper function to update courses with real enrollment counts and rating stats
const updateCoursesWithRealData = async (courses: Course[]): Promise<Course[]> => {
  try {
    const courseIds = courses.map(course => course.id);
    
    // Fetch enrollment counts and rating stats in parallel
    const [enrollmentCounts, ratingStatsPromises] = await Promise.all([
      getBulkEnrollmentCounts(courseIds),
      Promise.all(courseIds.map(id => getCourseRatingStats(id).catch(() => null)))
    ]);
    
    return courses.map((course, index) => {
      const ratingStats = ratingStatsPromises[index];
      return {
        ...course,
        enrollment_count: enrollmentCounts[course.id] || 0,
        average_rating: ratingStats?.average_rating || 0,
        total_ratings: ratingStats?.total_ratings || 0
      };
    });
  } catch (error) {
    console.error('Failed to fetch course data:', error);
    return courses; // Return original courses if fetch fails
  }
};

// Keep the old function for backward compatibility but use the new one
const updateCoursesWithEnrollmentCounts = updateCoursesWithRealData;

export const getAllCourses = async (): Promise<Course[]> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    return await updateCoursesWithEnrollmentCounts(courses);
  }

  const courses = await ApiAdapter.get<Course[]>('/courses');
  return await updateCoursesWithEnrollmentCounts(courses);
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    const course = courses.find((course: Course) => course.id === id);
    if (!course) return null;
    
    // Update with real enrollment count
    const coursesWithCounts = await updateCoursesWithEnrollmentCounts([course]);
    return coursesWithCounts[0];
  }

  try {
    const course = await ApiAdapter.get<Course>(`/courses/${id}`);
    const coursesWithCounts = await updateCoursesWithEnrollmentCounts([course]);
    return coursesWithCounts[0];
  } catch (error) {
    return null;
  }
};

export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    const newCourse: Course = {
      ...courseData,
      id: `demo_course_${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    courses.push(newCourse);
    DemoDataStore.set('courses', courses);
    return newCourse;
  }

  return ApiAdapter.authenticatedRequest<Course>('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  });
};

export const updateCourse = async (id: string, updates: Partial<Course>): Promise<Course | null> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    const courseIndex = courses.findIndex((course: Course) => course.id === id);
    
    if (courseIndex === -1) {
      return null;
    }
    
    courses[courseIndex] = {
      ...courses[courseIndex],
      ...updates,
      updated_at: new Date(),
    };
    
    DemoDataStore.set('courses', courses);
    return courses[courseIndex];
  }

  try {
    return await ApiAdapter.authenticatedRequest<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    return null;
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    const courseIndex = courses.findIndex((course: Course) => course.id === id);
    
    if (courseIndex === -1) {
      return false;
    }
    
    courses.splice(courseIndex, 1);
    DemoDataStore.set('courses', courses);
    return true;
  }

  try {
    await ApiAdapter.authenticatedRequest(`/courses/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    return courses.filter((course: Course) => 
      course.category.toLowerCase() === category.toLowerCase()
    );
  }

  return ApiAdapter.get<Course[]>(`/courses?category=${encodeURIComponent(category)}`);
};

export const searchCourses = async (query: string): Promise<Course[]> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    const lowercaseQuery = query.toLowerCase();
    return courses.filter((course: Course) => 
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  return ApiAdapter.get<Course[]>(`/courses/search?q=${encodeURIComponent(query)}`);
};

export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    return courses.filter((course: Course) => course.created_by === instructorId);
  }

  return ApiAdapter.get<Course[]>(`/courses?instructor=${instructorId}`);
};

export const enrollInCourse = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    await enrollmentServiceEnroll(courseId, userId);
    return true;
  } catch (error) {
    console.error('Enrollment failed:', error);
    return false;
  }
};

export const getEnrolledCourses = async (userId: string): Promise<Course[]> => {
  if (isDemo()) {
    // In demo mode, return a subset of courses as "enrolled"
    const courses = DemoDataStore.get('courses', demoCourses);
    return courses.slice(0, 2); // Return first 2 courses as enrolled
  }

  return ApiAdapter.authenticatedRequest<Course[]>(`/users/${userId}/courses`);
};

export const getFeaturedCourses = async (): Promise<Course[]> => {
  if (isDemo()) {
    const courses = DemoDataStore.get('courses', demoCourses);
    // Return courses with highest ratings or most enrollments
    return courses
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, 3);
  }

  return ApiAdapter.get<Course[]>('/courses/featured');
};
