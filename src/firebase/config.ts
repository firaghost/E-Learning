// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDydDUET5cdR09p63x5XknW0-OLQNXf0Uo",
  authDomain: "grownet-db408.firebaseapp.com",
  projectId: "grownet-db408",
  storageBucket: "grownet-db408.firebasestorage.app",
  messagingSenderId: "838240198116",
  appId: "1:838240198116:web:ff88978e4d28c2a312fbf1",
  measurementId: "G-PT7TR6BT39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;