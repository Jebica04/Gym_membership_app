import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import WorkoutListPage from "./components/WorkoutListPage";
import AddWorkoutPage from "./components/AddWorkoutPage";
import AccountPage from "./components/AccountPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Default Page */}
        <Route path="/workouts" element={<WorkoutListPage />} />
        <Route path="/add-workout" element={<AddWorkoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
