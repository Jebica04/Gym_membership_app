import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddWorkoutPage = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [videoLink, setVideoLink] = useState("");

  const handleAddWorkout = async () => {
    if (!name || !type || !muscleGroup || !reps || !sets || !videoLink) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "workouts"), {
        name,
        type,
        muscleGroup,
        reps: parseInt(reps),
        sets: parseInt(sets),
        videoLink,
      });
      alert("Workout added successfully!");
      setName("");
      setType("");
      setMuscleGroup("");
      setReps("");
      setSets("");
      setVideoLink("");
    } catch (error) {
      alert("Error adding workout: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Workout</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Workout Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Type of Exercise"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Muscle Group"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            placeholder="Number of Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            placeholder="Number of Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="YouTube Video Link"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleAddWorkout}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Add Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutPage;
