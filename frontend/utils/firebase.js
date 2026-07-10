// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "crafterai.firebaseapp.com",
  projectId: "crafterai",
  storageBucket: "crafterai.firebasestorage.app",
  messagingSenderId: "819128017777",
  appId: "1:819128017777:web:f7d9c071f0eb61b7e64cd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()