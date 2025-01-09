import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import WorkoutListPage from "./components/WorkoutListPage";
import AddWorkoutPage from "./components/AddWorkoutPage";
import AccountPage from "./components/AccountPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AdminPanel from "./components/AdminPanel";
import ChallengePage from "./components/ChallengePage"; // Import the new ChallengePage

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workouts" element={<WorkoutListPage />} />
        <Route path="/add-workout" element={<AddWorkoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/challenge" element={<ChallengePage />} /> {/* Add the Challenge Page */}
      </Routes>
    </Router>
  );
};

export default App;