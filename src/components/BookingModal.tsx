import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookingService';
import { Tutor } from '../types/Tutor';
import { BookingRequest } from '../types/Booking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: Tutor;
  onBookingSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, tutor, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'auth-check' | 'booking-form' | 'success'>('auth-check');
  const [formData, setFormData] = useState({
    session_type: 'individual' as 'individual' | 'group',
    duration: 60,
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      if (isAuthenticated) {
        setStep('booking-form');
      } else {
        setStep('auth-check');
      }
    }
  }, [isOpen, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePrice = () => {
    const baseRate = formData.session_type === 'individual' ? 500 : 300; // ETB per hour
    return (baseRate * formData.duration) / 60;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const bookingRequest: BookingRequest = {
        tutor_id: tutor.id,
        subject: tutor.subject,
        session_type: formData.session_type,
        duration: formData.duration,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        notes: formData.notes
      };

      await createBooking(user.id, user.name, bookingRequest);
      setStep('success');
      onBookingSuccess();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('auth-check');
    setFormData({
      session_type: 'individual',
      duration: 60,
      preferred_date: '',
      preferred_time: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold">
                {tutor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book Session with {tutor.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{tutor.subject} • {tutor.level}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'auth-check' && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Login Required
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Please log in to book a tutoring session with {tutor.name}
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/login"
                    className="px-6 py-3 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            )}

            {step === 'booking-form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tutor Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">Subject:</span>
                    <span className="text-gray-600 dark:text-gray-400">{tutor.subject}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">Experience:</span>
                    <span className="text-gray-600 dark:text-gray-400">{tutor.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Rating:</span>
                    <span className="text-gray-600 dark:text-gray-400">⭐ {tutor.rating}</span>
                  </div>
                </div>

                {/* Session Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Type
                  </label>
                  <select
                    name="session_type"
                    value={formData.session_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="individual">Individual Session (1-on-1)</option>
                    <option value="group">Group Session (2-5 students)</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      name="preferred_time"
                      value={formData.preferred_time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any specific topics you'd like to focus on or questions you have..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-ethiopia-green/10 border border-ethiopia-green/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Total Price:</span>
                    <span className="text-xl font-bold text-ethiopia-green">
                      {calculatePrice()} ETB
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formData.session_type === 'individual' ? '500 ETB/hour' : '300 ETB/hour'} • {formData.duration} minutes
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking Session...' : 'Book Session'}
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Booking Request Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your booking request has been sent to {tutor.name}. You'll receive a confirmation once the tutor accepts your request.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
