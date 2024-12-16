import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA74P4tN9T7E7FcGxqT99THr2xjpKv__2M",
    authDomain: "gymapp-bf52d.firebaseapp.com",
    projectId: "gymapp-bf52d",
    storageBucket: "gymapp-bf52d.firebasestorage.app",
    messagingSenderId: "242398328433",
    appId: "1:242398328433:web:c5a53e71e1fdeaf4cd0dd0",
    measurementId: "G-KRNWF4HQ6B"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
