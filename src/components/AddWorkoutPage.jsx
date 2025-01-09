import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const AddWorkoutPage = () => {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [videoLink, setVideoLink] = useState("");

  const isYouTubeUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname === "www.youtube.com" ||
        parsedUrl.hostname === "youtube.com" ||
        parsedUrl.hostname === "youtu.be"
      );
    } catch {
      return false;
    }
  };

  const handleAddWorkout = async () => {
    if (!name || !type || !muscleGroup || !reps || !sets || !videoLink) {
      alert("Completeaza toate campurile!");
      return;
    }

    if (!isYouTubeUrl(videoLink)) {
      alert("Please provide a valid YouTube video link.");
      return;
    }

    try {
      await addDoc(collection(db, "workouts"), {
        userId: user.email,
        name,
        type,
        muscleGroup,
        reps: parseInt(reps),
        sets: parseInt(sets),
        videoLink,
        saves: 0,
        savesList: [], // Initialize empty savesList
      });
      alert("Workout adaugat cu succes!");
      setName("");
      setType("");
      setMuscleGroup("");
      setReps("");
      setSets("");
      setVideoLink("");
    } catch (error) {
      alert("Eroare la adaugarea unui workout: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Adauga Workout</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nume Workout"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Tip de Exercitu"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Groupa Muschi "
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            placeholder="Numar of Repetari"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            placeholder="Numar de Seturi"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Link Video YouTube"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleAddWorkout}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Adauga Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutPage;
