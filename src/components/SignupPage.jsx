import React, { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email-based Sign-Up
  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Add user information to Firestore
      const userId = user.email; // Use email as ID
      await setDoc(doc(db, "users", userId), {
        name: "",
        email: user.email,
        age: null,
        gender: "",
      });
  
      navigate("/account"); // Redirect to account page
    } catch (error) {
      alert(error.message);
    }
  };

  // Google Sign-Up
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Check if user exists in Firestore, if not, create a new document
      const userDoc = doc(db, "users", user.email);
      await setDoc(userDoc, {
        name: "",
        email: user.email,
        age: null,
        gender: "",
        membership: "None",
        balance: 0,
      }, { merge: true });
  
      alert("Signed up cu succes cu Google!");
      navigate("/account"); // Redirect to account page
    } catch (error) {
      alert("Eroare la signing up cu Google: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sign Up cu Email
          </button>
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Sign Up cu Google
          </button>
        </div>
        <p className="text-center mt-4 text-sm">
          Ai deja cont?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
