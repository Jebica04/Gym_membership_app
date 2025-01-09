import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold mb-6">Transforma-ti Viata cu Poli Gym</h1>
      <p className="text-lg mb-12 text-center px-6">
        Pentru cand ai mers prea mult la sala de mese
      </p>
      <div className="space-x-4">
        <Link
          to="/workouts"
          className="bg-white text-blue-600 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100"
        >
          Descopera Workout-urile
        </Link>
        <Link
          to="/login"
          className="bg-transparent border border-white py-3 px-6 rounded-lg hover:bg-gray-100 hover:text-blue-600"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-transparent border border-white py-3 px-6 rounded-lg hover:bg-gray-100 hover:text-blue-600"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
  