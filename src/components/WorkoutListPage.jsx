import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import WorkoutDetailsModal from "./WorkoutDetailsModal";

const WorkoutListPage = () => {
  const [user] = useAuthState(auth);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Sorting and Filtering State
  const [sortBy, setSortBy] = useState("name"); // Default sort by name
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [filterType, setFilterType] = useState(""); // Filter by type
  const [filterMuscleGroup, setFilterMuscleGroup] = useState(""); // Filter by muscle group

  // Fetch all workouts from Firestore
  useEffect(() => {
    const fetchWorkouts = async () => {
      const querySnapshot = await getDocs(collection(db, "workouts"));
      const workoutsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkouts(workoutsData);
    };

    fetchWorkouts();
  }, []);

  // Sorting and Filtering Logic
  const sortedAndFilteredWorkouts = workouts
    .filter((workout) => {
      return (
        (filterType === "" || workout.type === filterType) &&
        (filterMuscleGroup === "" || workout.muscleGroup === filterMuscleGroup)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "saves") {
        return sortOrder === "asc" ? a.saves - b.saves : b.saves - a.saves;
      }
      return 0;
    });

  // Save a workout
  const handleSaveWorkout = async (event, workout) => {
    event.stopPropagation(); // Prevent triggering modal

    if (!user) {
      alert("Please log in to save workouts!");
      return;
    }

    if (!workout.savesList) {
      workout.savesList = [];
    }

    if (workout.savesList.includes(user.email)) {
      alert("Workout already saved!");
      return;
    }

    const newSavesList = [...workout.savesList, user.email];
    const workoutRef = doc(db, "workouts", workout.id);

    try {
      await updateDoc(workoutRef, {
        savesList: newSavesList,
        saves: (workout.saves || 0) + 1,
      });

      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((w) =>
          w.id === workout.id
            ? { ...w, savesList: newSavesList, saves: (workout.saves || 0) + 1 }
            : w
        )
      );
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save the workout. Please try again.");
    }
  };

  // Unsave a workout
  const handleUnsaveWorkout = async (event, workout) => {
    event.stopPropagation(); // Prevent triggering modal

    if (!user) {
      alert("Please log in to unsave workouts!");
      return;
    }

    if (!workout.savesList || !workout.savesList.includes(user.email)) {
      alert("Workout is not saved!");
      return;
    }

    const newSavesList = workout.savesList.filter((email) => email !== user.email);
    const workoutRef = doc(db, "workouts", workout.id);

    try {
      await updateDoc(workoutRef, {
        savesList: newSavesList,
        saves: Math.max(0, (workout.saves || 0) - 1),
      });

      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((w) =>
          w.id === workout.id
            ? { ...w, savesList: newSavesList, saves: Math.max(0, (workout.saves || 0) - 1) }
            : w
        )
      );
    } catch (error) {
      console.error("Error unsaving workout:", error);
      alert("Failed to unsave the workout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Workout-uri</h2>

      {/* Sorting and Filtering Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sorteaza Dupa</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Nume</option>
              <option value="saves">Salvari</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordoneaza</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asc">Ascendent</option>
              <option value="desc">Descendent</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtreaza dupa Tip</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toate</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Forta</option>
              <option value="Flexibility">Flexibilitate</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtreaza dupa Grupa de Muschi</label>
            <select
              value={filterMuscleGroup}
              onChange={(e) => setFilterMuscleGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toate</option>
              <option value="Chest">Piept</option>
              <option value="Back">Spate</option>
              <option value="Legs">Picioare</option>
              <option value="Arms">Brate</option>
              <option value="Core">Core</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedAndFilteredWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl"
            onClick={() => setSelectedWorkout(workout)} // Open modal for workout details
          >
            <div>
              <h4 className="font-bold">{workout.name}</h4>
              <p>
                {workout.muscleGroup} - {workout.reps} reps x {workout.sets} sets
              </p>
              <p>Favorit: {workout.saves} 🌟</p>
            </div>
            <div className="mt-4">
              {workout.savesList && workout.savesList.includes(user?.email) ? (
                <button
                  onClick={(event) => handleUnsaveWorkout(event, workout)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
                >
                  Unsave
                </button>
              ) : (
                <button
                  onClick={(event) => handleSaveWorkout(event, workout)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full"
                >
                  Salveaza
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Workout Details Modal */}
      {selectedWorkout && (
        <WorkoutDetailsModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
};

export default WorkoutListPage;