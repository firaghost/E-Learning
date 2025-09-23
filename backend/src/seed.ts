import { PrismaClient, UserRole, DifficultyLevel } from '@prisma/client';
import { AuthUtils } from './utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@grownet.et' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@grownet.et',
      password: await AuthUtils.hashPassword('admin123'),
      role: UserRole.ADMIN,
    },
  });

  // Create demo users
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@grownet.et' },
    update: {},
    create: {
      name: 'Kebede Alemu',
      email: 'student@grownet.et',
      password: await AuthUtils.hashPassword('student123'),
      role: UserRole.STUDENT,
    },
  });

  const tutorUser = await prisma.user.upsert({
    where: { email: 'tutor@grownet.et' },
    update: {},
    create: {
      name: 'Abebe Kebede',
      email: 'tutor@grownet.et',
      password: await AuthUtils.hashPassword('tutor123'),
      role: UserRole.TUTOR,
    },
  });

  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@grownet.et' },
    update: {},
    create: {
      name: 'EthioTech Solutions',
      email: 'employer@grownet.et',
      password: await AuthUtils.hashPassword('employer123'),
      role: UserRole.EMPLOYER,
    },
  });

  console.log('✅ Users created');

  // Create sample courses
  const courses = [
    {
      title: 'Ethiopian History and Culture',
      description: 'Comprehensive study of Ethiopian history from ancient times to modern era, including cultural traditions, languages, and heritage sites.',
      category: 'History',
      duration: '8 weeks',
      difficultyLevel: DifficultyLevel.BEGINNER,
      tags: ['History', 'Culture', 'Ethiopia', 'Heritage'],
      price: 0,
      instructorName: tutorUser.name,
      createdBy: tutorUser.id,
    },
    {
      title: 'Amharic Language for Beginners',
      description: 'Learn to speak, read, and write Amharic, the official language of Ethiopia. Perfect for beginners with no prior knowledge.',
      category: 'Language Learning',
      duration: '12 weeks',
      difficultyLevel: DifficultyLevel.BEGINNER,
      tags: ['Amharic', 'Language', 'Speaking', 'Writing'],
      price: 49.99,
      instructorName: tutorUser.name,
      createdBy: tutorUser.id,
    },
    {
      title: 'Traditional Ethiopian Cooking',
      description: 'Master the art of Ethiopian cuisine including injera making, berbere spice preparation, and traditional dishes.',
      category: 'Culinary Arts',
      duration: '6 weeks',
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      tags: ['Cooking', 'Ethiopian Food', 'Injera', 'Spices'],
      price: 79.99,
      instructorName: 'Chef Almaz Tadesse',
      createdBy: tutorUser.id,
    },
    {
      title: 'Ethiopian Coffee Culture and Ceremony',
      description: 'Discover the rich tradition of Ethiopian coffee, from bean to cup, including the traditional coffee ceremony.',
      category: 'Arts & Culture',
      duration: '4 weeks',
      difficultyLevel: DifficultyLevel.BEGINNER,
      tags: ['Coffee', 'Ceremony', 'Culture', 'Tradition'],
      price: 29.99,
      instructorName: 'Meron Haile',
      createdBy: tutorUser.id,
    },
    {
      title: 'Business Development in Ethiopia',
      description: 'Learn about starting and growing a business in Ethiopia, including legal requirements, market analysis, and funding opportunities.',
      category: 'Business',
      duration: '10 weeks',
      difficultyLevel: DifficultyLevel.ADVANCED,
      tags: ['Business', 'Entrepreneurship', 'Ethiopia', 'Development'],
      price: 149.99,
      instructorName: employerUser.name,
      createdBy: employerUser.id,
    },
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { 
        title: courseData.title,
      },
      update: {},
      create: courseData,
    });
    createdCourses.push(course);
  }

  console.log('✅ Courses created');

  // Create sample enrollments
  const enrollments = [
    {
      courseId: createdCourses[0].id,
      userId: studentUser.id,
      progress: 75,
    },
    {
      courseId: createdCourses[1].id,
      userId: studentUser.id,
      progress: 50,
    },
    {
      courseId: createdCourses[2].id,
      userId: studentUser.id,
      progress: 25,
    },
    {
      courseId: createdCourses[0].id,
      userId: employerUser.id,
      progress: 100,
      completedAt: new Date(),
    },
  ];

  for (const enrollmentData of enrollments) {
    await prisma.enrollment.upsert({
      where: {
        courseId_userId: {
          courseId: enrollmentData.courseId,
          userId: enrollmentData.userId,
        },
      },
      update: {},
      create: {
        ...enrollmentData,
        lastAccessed: new Date(),
      },
    });
  }

  console.log('✅ Enrollments created');

  // Create sample reviews
  const reviews = [
    {
      courseId: createdCourses[0].id,
      userId: studentUser.id,
      userName: studentUser.name,
      rating: 5,
      review: 'Excellent course! Very comprehensive and well-structured. The instructor explains Ethiopian history in a captivating way.',
    },
    {
      courseId: createdCourses[0].id,
      userId: employerUser.id,
      userName: employerUser.name,
      rating: 4,
      review: 'Great content for understanding Ethiopian heritage. Helpful for business context.',
    },
    {
      courseId: createdCourses[1].id,
      userId: studentUser.id,
      userName: studentUser.name,
      rating: 5,
      review: 'Amazing Amharic course! The teaching method is very effective and practical.',
    },
    {
      courseId: createdCourses[2].id,
      userId: studentUser.id,
      userName: studentUser.name,
      rating: 4,
      review: 'Love learning traditional cooking techniques. The recipes are authentic and delicious.',
    },
  ];

  for (const reviewData of reviews) {
    await prisma.review.upsert({
      where: {
        courseId_userId: {
          courseId: reviewData.courseId,
          userId: reviewData.userId,
        },
      },
      update: {},
      create: reviewData,
    });
  }

  console.log('✅ Reviews created');

  // Create sample comments
  const comments = [
    {
      courseId: createdCourses[0].id,
      userId: studentUser.id,
      userName: studentUser.name,
      content: 'This course has really opened my eyes to the rich history of our country. Thank you!',
    },
    {
      courseId: createdCourses[1].id,
      userId: employerUser.id,
      userName: employerUser.name,
      content: 'The pronunciation guides are very helpful. Looking forward to practicing more.',
    },
  ];

  for (const commentData of comments) {
    await prisma.comment.create({
      data: commentData,
    });
  }

  console.log('✅ Comments created');

  // Create sample bookings
  const bookings = [
    {
      userId: studentUser.id,
      tutorName: 'Dr. Tadesse Bekele',
      subject: 'Advanced Amharic Grammar',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      time: '14:00',
      duration: 60,
      price: 25.00,
      status: 'confirmed',
      notes: 'Focus on complex sentence structures',
    },
    {
      userId: employerUser.id,
      tutorName: 'Prof. Almaz Mekonnen',
      subject: 'Ethiopian Business Law',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: '10:00',
      duration: 90,
      price: 50.00,
      status: 'pending',
      notes: 'Discuss legal requirements for tech startups',
    },
  ];

  for (const bookingData of bookings) {
    await prisma.booking.create({
      data: bookingData,
    });
  }

  console.log('✅ Bookings created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('👤 Admin: admin@grownet.et / admin123');
  console.log('🎓 Student: student@grownet.et / student123');
  console.log('👨‍🏫 Tutor: tutor@grownet.et / tutor123');
  console.log('🏢 Employer: employer@grownet.et / employer123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
