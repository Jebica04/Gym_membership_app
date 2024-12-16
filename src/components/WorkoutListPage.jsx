import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import WorkoutDetailsModal from "./WorkoutDetailsModal";

const WorkoutListPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [filter, setFilter] = useState("");

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

  const filteredWorkouts = filter
    ? workouts.filter((workout) => workout.muscleGroup === filter)
    : workouts;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Workouts</h2>

      <div className="flex justify-center mb-6">
        <select
          className="border rounded-lg p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Muscle Groups</option>
          {Array.from(new Set(workouts.map((w) => w.muscleGroup))).map(
            (group) => (
              <option key={group} value={group}>
                {group}
              </option>
            )
          )}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl"
            onClick={() => setSelectedWorkout(workout)}
          >
            <h3 className="text-xl font-bold mb-2">{workout.name}</h3>
            <p className="text-sm">Type: {workout.type}</p>
            <p className="text-sm">Muscle Group: {workout.muscleGroup}</p>
            <p className="text-sm">Reps: {workout.reps}</p>
          </div>
        ))}
      </div>

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
