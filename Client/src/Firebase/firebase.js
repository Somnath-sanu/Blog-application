
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d48f2.firebaseapp.com",
  projectId: "mern-blog-d48f2",
  storageBucket: "mern-blog-d48f2.appspot.com",
  messagingSenderId: "627131582447",
  appId: "1:627131582447:web:cee0ac78c4ab003a7e981a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
