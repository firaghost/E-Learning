import { CourseEnrollment } from '../types/Course';
import { ApiAdapter, DemoDataStore } from './apiAdapter';
import { isDemo } from '../config/environment';

// Demo enrollment data
const demoEnrollments: CourseEnrollment[] = [
  {
    id: '1',
    course_id: '1',
    user_id: '2',
    enrolled_at: new Date('2024-01-10'),
    progress: 75,
    last_accessed: new Date('2024-01-20'),
  },
  {
    id: '2',
    course_id: '1',
    user_id: '4',
    enrolled_at: new Date('2024-01-12'),
    progress: 50,
    last_accessed: new Date('2024-01-18'),
  },
  {
    id: '3',
    course_id: '2',
    user_id: '2',
    enrolled_at: new Date('2024-01-15'),
    progress: 25,
    last_accessed: new Date('2024-01-22'),
  },
  {
    id: '4',
    course_id: '3',
    user_id: '4',
    enrolled_at: new Date('2024-01-20'),
    progress: 90,
    completed_at: new Date('2024-01-25'),
    last_accessed: new Date('2024-01-25'),
  },
];

// Initialize demo data
if (isDemo()) {
  const storedEnrollments = DemoDataStore.get('enrollments', demoEnrollments);
  if (storedEnrollments.length === 0) {
    DemoDataStore.set('enrollments', demoEnrollments);
  }
}

export interface EnrollmentStats {
  course_id: string;
  total_enrollments: number;
  active_students: number;
  completion_rate: number;
  average_progress: number;
}

export const enrollmentService = {
  // Enroll a user in a course
  enrollInCourse: async (courseId: string, userId: string): Promise<CourseEnrollment> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      
      // Check if user is already enrolled
      const existingEnrollment = enrollments.find((e: CourseEnrollment) => 
        e.course_id === courseId && e.user_id === userId
      );
      
      if (existingEnrollment) {
        throw new Error('User is already enrolled in this course');
      }

      // Create new enrollment
      const newEnrollment: CourseEnrollment = {
        id: `enrollment_${Date.now()}`,
        course_id: courseId,
        user_id: userId,
        enrolled_at: new Date(),
        progress: 0,
        last_accessed: new Date(),
      };

      enrollments.push(newEnrollment);
      DemoDataStore.set('enrollments', enrollments);

      return newEnrollment;
    }

    // Production mode - real API call
    const response = await ApiAdapter.authenticatedRequest<CourseEnrollment>(`/courses/${courseId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    return response;
  },

  // Get all enrollments for a course
  getCourseEnrollments: async (courseId: string): Promise<CourseEnrollment[]> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      return enrollments.filter((enrollment: CourseEnrollment) => enrollment.course_id === courseId);
    }

    // Production mode - real API call
    const response = await ApiAdapter.get<CourseEnrollment[]>(`/courses/${courseId}/enrollments`);
    return response;
  },

  // Get enrollment count for a course
  getCourseEnrollmentCount: async (courseId: string): Promise<number> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      return enrollments.filter((enrollment: CourseEnrollment) => enrollment.course_id === courseId).length;
    }

    // Production mode - real API call
    const response = await ApiAdapter.get<{ count: number }>(`/courses/${courseId}/enrollment-count`);
    return response.count;
  },

  // Get enrollment statistics for a course
  getCourseEnrollmentStats: async (courseId: string): Promise<EnrollmentStats> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      const courseEnrollments = enrollments.filter((enrollment: CourseEnrollment) => enrollment.course_id === courseId);
      
      if (courseEnrollments.length === 0) {
        return {
          course_id: courseId,
          total_enrollments: 0,
          active_students: 0,
          completion_rate: 0,
          average_progress: 0,
        };
      }

      const totalEnrollments = courseEnrollments.length;
      const completedEnrollments = courseEnrollments.filter((e: CourseEnrollment) => e.completed_at).length;
      const activeStudents = courseEnrollments.filter((e: CourseEnrollment) => {
        const lastAccessed = new Date(e.last_accessed || e.enrolled_at);
        const daysSinceAccess = (Date.now() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceAccess <= 30; // Active if accessed within 30 days
      }).length;
      
      const totalProgress = courseEnrollments.reduce((sum: number, e: CourseEnrollment) => sum + e.progress, 0);
      const averageProgress = totalProgress / totalEnrollments;

      return {
        course_id: courseId,
        total_enrollments: totalEnrollments,
        active_students: activeStudents,
        completion_rate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
        average_progress: averageProgress,
      };
    }

    // Production mode - real API call
    const response = await ApiAdapter.get<EnrollmentStats>(`/courses/${courseId}/enrollment-stats`);
    return response;
  },

  // Get all enrollments for a user
  getUserEnrollments: async (userId: string): Promise<CourseEnrollment[]> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      return enrollments.filter((enrollment: CourseEnrollment) => enrollment.user_id === userId);
    }

    // Production mode - real API call
    const response = await ApiAdapter.authenticatedRequest<CourseEnrollment[]>(`/users/${userId}/enrollments`);
    return response;
  },

  // Check if a user is enrolled in a course
  isUserEnrolled: async (courseId: string, userId: string): Promise<boolean> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      return enrollments.some((enrollment: CourseEnrollment) => 
        enrollment.course_id === courseId && enrollment.user_id === userId
      );
    }

    // Production mode - real API call
    try {
      await ApiAdapter.authenticatedRequest(`/courses/${courseId}/enrollment/${userId}`);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Update enrollment progress
  updateEnrollmentProgress: async (enrollmentId: string, progress: number): Promise<CourseEnrollment> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      const enrollmentIndex = enrollments.findIndex((e: CourseEnrollment) => e.id === enrollmentId);
      
      if (enrollmentIndex === -1) {
        throw new Error('Enrollment not found');
      }

      enrollments[enrollmentIndex] = {
        ...enrollments[enrollmentIndex],
        progress,
        last_accessed: new Date(),
        completed_at: progress >= 100 ? new Date() : undefined,
      };

      DemoDataStore.set('enrollments', enrollments);
      return enrollments[enrollmentIndex];
    }

    // Production mode - real API call
    const response = await ApiAdapter.authenticatedRequest<CourseEnrollment>(`/enrollments/${enrollmentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });

    return response;
  },

  // Unenroll from a course
  unenrollFromCourse: async (courseId: string, userId: string): Promise<void> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      const filteredEnrollments = enrollments.filter((e: CourseEnrollment) => 
        !(e.course_id === courseId && e.user_id === userId)
      );
      DemoDataStore.set('enrollments', filteredEnrollments);
      return;
    }

    // Production mode - real API call
    await ApiAdapter.authenticatedRequest(`/courses/${courseId}/unenroll`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  // Get enrollment counts for multiple courses (bulk operation)
  getBulkEnrollmentCounts: async (courseIds: string[]): Promise<Record<string, number>> => {
    if (isDemo()) {
      const enrollments = DemoDataStore.get('enrollments', demoEnrollments);
      const counts: Record<string, number> = {};
      
      courseIds.forEach(courseId => {
        counts[courseId] = enrollments.filter((enrollment: CourseEnrollment) => 
          enrollment.course_id === courseId
        ).length;
      });

      return counts;
    }

    // Production mode - real API call
    const response = await ApiAdapter.post<Record<string, number>>('/courses/enrollment-counts', {
      courseIds,
    });

    return response;
  },
};

// Export individual functions for easier importing
export const {
  enrollInCourse,
  getCourseEnrollments,
  getCourseEnrollmentCount,
  getCourseEnrollmentStats,
  getUserEnrollments,
  isUserEnrolled,
  updateEnrollmentProgress,
  unenrollFromCourse,
  getBulkEnrollmentCounts,
} = enrollmentService;
