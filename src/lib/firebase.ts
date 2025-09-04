
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgGI6HPXZpDAL48kh9ALvmOziIF6QX8UU",
  authDomain: "pajakbro.firebaseapp.com",
  projectId: "pajakbro",
  storageBucket: "pajakbro.firebasestorage.app",
  messagingSenderId: "341200875121",
  appId: "1:341200875121:web:058977c2bf60496ec7f5d0",
  measurementId: "G-CRKD41S9CD"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
