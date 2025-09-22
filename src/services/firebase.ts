import { getAuth, GoogleAuthProvider, signInWithPopup, User, AuthError } from 'firebase/auth';
import '../firebase/config'; // This will initialize Firebase

// Get auth instance
const auth = getAuth();

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
const signInWithGoogle = async (): Promise<{ user: User; token: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();
    
    return { user, token };
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Handle specific Firebase errors
    const firebaseError = error as AuthError;
    if (firebaseError.code === 'auth/configuration-not-found') {
      throw new Error('Google authentication is not enabled for this application. Please contact support or use email/password login.');
    } else if (firebaseError.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by your browser. Please allow popups for this site and try again.');
    } else if (firebaseError.code === 'auth/cancelled-popup-request') {
      throw new Error('Authentication popup was closed before completing sign-in.');
    } else if (firebaseError.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error('Failed to sign in with Google. Please try again or use email/password login.');
    }
  }
};

// Sign out
const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export { auth, signInWithGoogle, signOut };