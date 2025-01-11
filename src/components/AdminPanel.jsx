import React, { useState } from "react";
import UserManagementModule from "./UserManagementModule";
import MembershipManagementModule from "./MembershipManagementModule";
import WorkoutManagementModule from "./WorkoutManagementModule";
import AnalyticsModule from "./AnalyticsModule";
import ChallengeManagementModule from "./ChallengeManagementModule";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Tab Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "users"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Management Useri
        </button>
        <button
          onClick={() => setActiveTab("memberships")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "memberships"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Management Membership-uri 
        </button>
        <button
          onClick={() => setActiveTab("workouts")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "workouts"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Management Workout-uri
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "analytics"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("challenges")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "challenges"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Challenge-uri
        </button>
      </div>

      {/* Conditional Rendering of Modules */}
      {activeTab === "users" && <UserManagementModule />}
      {activeTab === "memberships" && <MembershipManagementModule />}
      {activeTab === "workouts" && <WorkoutManagementModule />}
      {activeTab === "analytics" && <AnalyticsModule />}
      {activeTab === "challenges" && <ChallengeManagementModule />}
    </div>
  );
};

export default AdminPanel;