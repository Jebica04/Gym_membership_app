import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const WorkoutManagementModule = () => {
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedMuscleGroup, setEditedMuscleGroup] = useState("");
  const [editedReps, setEditedReps] = useState("");
  const [editedSets, setEditedSets] = useState("");
  const [editedLink, setEditedLink] = useState("");

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

  // Validate YouTube URL
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

  // Edit workout details
  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setEditedName(workout.name);
    setEditedType(workout.type);
    setEditedMuscleGroup(workout.muscleGroup);
    setEditedReps(workout.reps);
    setEditedSets(workout.sets);
    setEditedLink(workout.videoLink);
  };

  // Save edited workout details
  const saveEditedWorkout = async () => {
    if (!isYouTubeUrl(editedLink)) {
      alert("Please provide a valid YouTube video link.");
      return;
    }

    try {
      await updateDoc(doc(db, "workouts", editingWorkout.id), {
        name: editedName,
        type: editedType,
        muscleGroup: editedMuscleGroup,
        reps: parseInt(editedReps),
        sets: parseInt(editedSets),
        videoLink: editedLink,
      });
      alert("Workout updated successfully!");
      setEditingWorkout(null);
      // Refresh workout list
      const querySnapshot = await getDocs(collection(db, "workouts"));
      const workoutsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkouts(workoutsData);
    } catch (error) {
      alert("Error updating workout: " + error.message);
    }
  };

  // Delete a workout
  const handleDeleteWorkout = async (id) => {
    try {
      await deleteDoc(doc(db, "workouts", id));
      setWorkouts(workouts.filter((workout) => workout.id !== id));
      alert("Workout deleted successfully!");
    } catch (error) {
      alert("Error deleting workout: " + error.message);
    }
  };

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Workout Management</h3>

      {/* Sorting and Filtering Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="name">Name</option>
                <option value="saves">Saves</option>
            </select>
            </div>
            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
            </div>
        </div>


        <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Types</option>
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="Flexibility">Flexibility</option>
            </select>
            </div>
            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Muscle Group</label>
            <select
                value={filterMuscleGroup}
                onChange={(e) => setFilterMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Muscle Groups</option>
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Arms">Arms</option>
                <option value="Core">Core</option>
            </select>
            </div>
        </div>
    </div>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Muscle Group</th>
            <th className="px-4 py-2 text-left">Reps x Sets</th>
            <th className="px-4 py-2 text-left">Saves</th>
            <th className="px-4 py-2 text-left">Video Link</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredWorkouts.map((workout) => (
            <tr key={workout.id} className="border-b">
              <td className="px-4 py-2 text-left">{workout.name}</td>
              <td className="px-4 py-2 text-left">{workout.type}</td>
              <td className="px-4 py-2 text-left">{workout.muscleGroup}</td>
              <td className="px-4 py-2 text-left">
                {workout.reps} x {workout.sets}
              </td>
              <td className="px-4 py-2 text-left">{workout.saves || 0}</td>
              <td className="px-4 py-2 text-left">
                <a
                  href={workout.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Watch Video
                </a>
              </td>
              <td className="px-4 py-2 text-left">
                <button
                  onClick={() => handleEditWorkout(workout)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteWorkout(workout.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Workout Modal */}
      {editingWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Workout</h3>
            <input
              type="text"
              placeholder="Name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="Type"
              value={editedType}
              onChange={(e) => setEditedType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="Muscle Group"
              value={editedMuscleGroup}
              onChange={(e) => setEditedMuscleGroup(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="number"
              placeholder="Reps"
              value={editedReps}
              onChange={(e) => setEditedReps(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="number"
              placeholder="Sets"
              value={editedSets}
              onChange={(e) => setEditedSets(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="YouTube Video Link"
              value={editedLink}
              onChange={(e) => setEditedLink(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <button
              onClick={saveEditedWorkout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingWorkout(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutManagementModule;