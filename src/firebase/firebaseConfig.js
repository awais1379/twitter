// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzs6caNUoTegT_IdKb_FYdWTjc26lqXGI",
  authDomain: "twitter-41a66.firebaseapp.com",
  projectId: "twitter-41a66",
  storageBucket: "twitter-41a66.firebasestorage.app",
  messagingSenderId: "539804135832",
  appId: "1:539804135832:web:7cb435525d489439607bed",
  measurementId: "G-VWJ4J4WGLZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
