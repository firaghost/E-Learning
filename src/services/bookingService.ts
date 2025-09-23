import { Booking, BookingRequest, TutorSession } from '../types/Booking';

// Mock data for bookings
let bookingsData: Booking[] = [];

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create a new booking
export const createBooking = async (studentId: string, studentName: string, bookingRequest: BookingRequest): Promise<Booking> => {
  await delay(500);
  
  const newBooking: Booking = {
    id: generateId(),
    student_id: studentId,
    student_name: studentName,
    tutor_id: bookingRequest.tutor_id,
    tutor_name: '', // This would be fetched from tutor data
    subject: bookingRequest.subject,
    session_type: bookingRequest.session_type,
    duration: bookingRequest.duration,
    scheduled_date: new Date(bookingRequest.preferred_date),
    scheduled_time: bookingRequest.preferred_time,
    status: 'pending',
    notes: bookingRequest.notes,
    price: calculatePrice(bookingRequest.duration, bookingRequest.session_type),
    created_at: new Date(),
  };
  
  bookingsData.push(newBooking);
  return newBooking;
};

// Calculate booking price
const calculatePrice = (duration: number, sessionType: 'individual' | 'group'): number => {
  const baseRate = sessionType === 'individual' ? 500 : 300; // ETB per hour
  return (baseRate * duration) / 60; // Convert to per minute rate
};

// Get bookings for a student
export const getStudentBookings = async (studentId: string): Promise<Booking[]> => {
  await delay(300);
  return bookingsData.filter(booking => booking.student_id === studentId);
};

// Get bookings for a tutor
export const getTutorBookings = async (tutorId: string): Promise<Booking[]> => {
  await delay(300);
  return bookingsData.filter(booking => booking.tutor_id === tutorId);
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<Booking | null> => {
  await delay(400);
  
  const bookingIndex = bookingsData.findIndex(booking => booking.id === bookingId);
  if (bookingIndex === -1) {
    return null;
  }
  
  bookingsData[bookingIndex] = {
    ...bookingsData[bookingIndex],
    status,
    updated_at: new Date(),
  };
  
  return bookingsData[bookingIndex];
};

// Cancel booking
export const cancelBooking = async (bookingId: string, userId: string): Promise<boolean> => {
  await delay(400);
  
  const bookingIndex = bookingsData.findIndex(booking => 
    booking.id === bookingId && 
    (booking.student_id === userId || booking.tutor_id === userId)
  );
  
  if (bookingIndex === -1) {
    return false;
  }
  
  bookingsData[bookingIndex] = {
    ...bookingsData[bookingIndex],
    status: 'cancelled',
    updated_at: new Date(),
  };
  
  return true;
};

// Get booking by ID
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  await delay(200);
  return bookingsData.find(booking => booking.id === bookingId) || null;
};

// Get upcoming bookings
export const getUpcomingBookings = async (userId: string): Promise<Booking[]> => {
  await delay(300);
  const now = new Date();
  
  return bookingsData.filter(booking => 
    (booking.student_id === userId || booking.tutor_id === userId) &&
    booking.scheduled_date >= now &&
    booking.status !== 'cancelled'
  ).sort((a, b) => a.scheduled_date.getTime() - b.scheduled_date.getTime());
};

// Create session from booking
export const createSession = async (bookingId: string): Promise<TutorSession | null> => {
  await delay(400);
  
  const booking = await getBookingById(bookingId);
  if (!booking || booking.status !== 'confirmed') {
    return null;
  }
  
  const session: TutorSession = {
    id: `session_${Date.now()}`,
    tutor_id: booking.tutor_id,
    student_id: booking.student_id,
    booking_id: booking.id,
    subject: booking.subject,
    start_time: new Date(booking.scheduled_date),
    end_time: new Date(booking.scheduled_date.getTime() + booking.duration * 60000),
    status: 'scheduled',
    meeting_link: `https://meet.grownet.et/${booking.id}`,
    created_at: new Date(),
  };
  
  return session;
};
