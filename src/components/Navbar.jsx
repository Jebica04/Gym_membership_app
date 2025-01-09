import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-lg font-bold">FitLife Gym</h1>
      <div>
        <Link to="/" className="mr-4 hover:underline">
          Acasa
        </Link>
        <Link to="/workouts" className="mr-4 hover:underline">
          Workout-uri
        </Link>
        <Link to="/challenge" className="mr-4 hover:underline">
          Challenge
        </Link>
        <Link to="/admin" className="mr-4 hover:underline">
          admin
        </Link>
        {user && (<Link to="/add-workout" className="mr-4 hover:underline">
          Adauga Workout
        </Link>)}
        {user ? (
          <>
            <Link to="/account" className="mr-4 hover:underline">
              Contul Meu
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
