import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import WorkoutDetailsModal from "./WorkoutDetailsModal";
import { Timestamp } from "firebase/firestore"; // Import Timestamp

const AccountPage = () => {
  const [user] = useAuthState(auth);

  // User details
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [membership, setMembership] = useState("None"); // Current membership
  const [membershipExpiration, setMembershipExpiration] = useState(null); // Expiration date
  const [balance, setBalance] = useState(0); // User's balance

  // Workouts and Saved Workouts
  const [workouts, setWorkouts] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Modal state
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Editing Workouts
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedMuscleGroup, setEditedMuscleGroup] = useState("");
  const [editedReps, setEditedReps] = useState("");
  const [editedSets, setEditedSets] = useState("");
  const [editedLink, setEditedLink] = useState("");

  // Section switching
  const [activeTab, setActiveTab] = useState("info");

  // Membership purchase
  const [addFundsAmount, setAddFundsAmount] = useState(0); // Amount to add to balance
  const [selectedMembership, setSelectedMembership] = useState("None"); // Selected membership for purchase

  // Membership prices
  const membershipPrices = {
    Basic: 10,
    Gold: 20,
    Platinum: 30,
  };

  // Fetch user info from Firestore
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setAge(userData.age || "");
          setGender(userData.gender || "");
          setMembership(userData.membership || "None");
          setMembershipExpiration(userData.membershipExpiration?.toDate() || null);
          setBalance(userData.balance || 0);

          // Check if membership has expired
          if (userData.membershipExpiration) {
            const expirationDate = userData.membershipExpiration.toDate();
            if (new Date() > expirationDate) {
              // Membership has expired
              await updateDoc(doc(db, "users", user.email), {
                membership: "None",
                membershipExpiration: null,
              });
              setMembership("None");
              setMembershipExpiration(null);
              alert("Your membership has expired.");
            }
          }
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  // Save user info to Firestore
  const handleSaveUserInfo = async () => {
    try {
      await updateDoc(doc(db, "users", user.email), {
        name,
        age,
        gender,
        membership,
        membershipExpiration,
        balance,
      });
      alert("Information saved successfully!");
    } catch (error) {
      alert("Error saving information: " + error.message);
    }
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setEditedName(workout.name);
    setEditedType(workout.type);
    setEditedMuscleGroup(workout.muscleGroup);
    setEditedReps(workout.reps);
    setEditedSets(workout.sets);
    setEditedLink(workout.videoLink);
  };

  const saveEditedWorkout = async () => {
    try {
      await updateDoc(doc(db, "workouts", editingWorkout.id), {
        name: editedName,
        type: editedType,
        muscleGroup: editedMuscleGroup,
        reps: parseInt(editedReps),
        sets: parseInt(editedSets),
        videoLink: editedLink,
      });

      setWorkouts(
        workouts.map((workout) =>
          workout.id === editingWorkout.id
            ? {
                ...workout,
                name: editedName,
                type: editedType,
                muscleGroup: editedMuscleGroup,
                reps: editedReps,
                sets: editedSets,
                link: editedLink,
              }
            : workout
        )
      );

      alert("Workout updated successfully!");
      setEditingWorkout(null); // Close the edit form
    } catch (error) {
      alert("Error updating workout: " + error.message);
    }
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "workouts"));
        const workoutsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((workout) => workout.userId === user.email); // Filter by user's email
        setWorkouts(workoutsData);
      }
    };
  
    fetchWorkouts();
  }, [user]);

  useEffect(() => {
    const fetchSavedWorkouts = async () => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "workouts"));
        const savedWorkoutsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((workout) => workout.savesList?.includes(user.email)); // Filter by user's email in savesList
        setSavedWorkouts(savedWorkoutsData);
      }
    };
  
    fetchSavedWorkouts();
  }, [user]);

  const handleDeleteWorkout = async (id) => {
    try {
      await deleteDoc(doc(db, "workouts", id));
      setWorkouts(workouts.filter((workout) => workout.id !== id));
    } catch (error) {
      alert("Error deleting workout: " + error.message);
    }
  };

  const handleSaveWorkout = async (workout) => {
    if (!workout.savesList) {
      workout.savesList = [];
    }

    if (workout.savesList.includes(user.email)) {
      alert("Workout already saved!");
      return;
    }

    const newSavesList = [...workout.savesList, user.email];
    const workoutRef = doc(db, "workouts", workout.id);
    await updateDoc(workoutRef, {
      savesList: newSavesList,
      saves: (workout.saves || 0) + 1,
    });

    setSavedWorkouts([...savedWorkouts, workout]);
  };

  const handleUnsaveWorkout = async (workout) => {
    if (!workout.savesList || !workout.savesList.includes(user.email)) {
      alert("Workout not saved!");
      return;
    }

    const newSavesList = workout.savesList.filter((email) => email !== user.email);
    const workoutRef = doc(db, "workouts", workout.id);
    await updateDoc(workoutRef, {
      savesList: newSavesList,
      saves: Math.max(0, (workout.saves || 0) - 1),
    });

    setSavedWorkouts(
      savedWorkouts.filter((savedWorkout) => savedWorkout.id !== workout.id)
    );
  };

  // Add funds to the user's balance
  const handleAddFunds = async () => {
    if (addFundsAmount <= 0) {
      alert("Please enter a valid amount to add.");
      return;
    }

    const newBalance = balance + parseFloat(addFundsAmount);
    setBalance(newBalance);

    // Update balance in Firestore
    await updateDoc(doc(db, "users", user.email), {
      balance: newBalance,
    });

    alert(`Added $${addFundsAmount} to your balance.`);
    setAddFundsAmount(0); // Reset the input field
  };

  // Purchase a membership
  const handlePurchaseMembership = async () => {
    if (selectedMembership === "None") {
      alert("Please select a membership to purchase.");
      return;
    }
  
    const price = membershipPrices[selectedMembership];
    if (balance < price) {
      alert("Insufficient balance to purchase this membership.");
      return;
    }
  
    const newBalance = balance - price;
    setBalance(newBalance);
  
    // Calculate expiration date (one month from now)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
  
    // Convert to Firestore Timestamp
    const firestoreTimestamp = Timestamp.fromDate(expirationDate);
  
    // Debugging: Log the data being saved
    console.log("Expiration Date (JavaScript Date):", expirationDate);
    console.log("Firestore Timestamp:", firestoreTimestamp);
  
    try {
      // Update membership and expiration date in Firestore
      await updateDoc(doc(db, "users", user.email), {
        balance: newBalance,
        membership: selectedMembership,
        membershipExpiration: firestoreTimestamp, // Save as a Firestore Timestamp
      });
  
      // Update local state
      setMembership(selectedMembership);
      setMembershipExpiration(expirationDate);
  
      alert(`You have successfully purchased the ${selectedMembership} membership!`);
    } catch (error) {
      console.error("Error updating Firestore document:", error);
      alert("Failed to purchase membership. Please try again.");
    }
  };

  // Render membership expiration date
  const renderMembershipExpiration = () => {
    if (membershipExpiration) {
      return (
        <p className="mb-2">
          Membership Expires: <strong>{membershipExpiration.toLocaleDateString()}</strong>
        </p>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "info"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Informatiile Mele
        </button>
        <button
          onClick={() => setActiveTab("workouts")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "workouts"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Workout-urile Mele
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
            activeTab === "saved"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          Workout-uri Salvate
        </button>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "info" && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Informatii Personale</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nume"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Varsta"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Selecteaza Gen</option>
              <option value="Male">Barbat</option>
              <option value="Female">Femeie</option>
              <option value="Other">Altul</option>
            </select>
            <button
              onClick={handleSaveUserInfo}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Salveaza Informatiile
            </button>
          </div>

          {/* Membership Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Membership</h3>
            <p className="mb-2">Current Membership: <strong>{membership}</strong></p>
            {renderMembershipExpiration()}
            <p className="mb-2">Current Balance: <strong>${balance}</strong></p>

            {/* Add Funds */}
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Amount to add"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleAddFunds}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Add Funds
              </button>
            </div>

            {/* Purchase Membership */}
            <div className="mt-6">
              <select
                value={selectedMembership}
                onChange={(e) => setSelectedMembership(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="None">Select Membership</option>
                <option value="Basic">Basic ($10)</option>
                <option value="Gold">Gold ($20)</option>
                <option value="Platinum">Platinum ($30)</option>
              </select>
              <button
                onClick={handlePurchaseMembership}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 mt-4"
              >
                Purchase Membership
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "workouts" && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          {workouts.length === 0 ? (
            <p>Nu exista workout-uri adaugate.</p>
          ) : (
            editingWorkout ? (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold mb-4">Editeaza Workout-ul</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editedMuscleGroup}
                    onChange={(e) => setEditedMuscleGroup(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    value={editedReps}
                    onChange={(e) => setEditedReps(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    value={editedSets}
                    onChange={(e) => setEditedSets(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editedLink}
                    onChange={(e) => setEditedLink(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={saveEditedWorkout}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Salveaza Schimbarile
                  </button>
                  <button
                    onClick={() => setEditingWorkout(null)}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 mt-2"
                  >
                    Anuleza
                  </button>
                </div>
              </div>
            ) : (
              workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex justify-between items-center bg-gray-100 mb-4 p-4 rounded-lg shadow"
                >
                  <div>
                    <h4 className="font-bold">{workout.name}</h4>
                    <p>
                      {workout.muscleGroup} - {workout.reps} reps x {workout.sets} sets
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditWorkout(workout)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Editeaza
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Sterge
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          {savedWorkouts.length === 0 ? (
            <p>No saved workouts yet.</p>
          ) : (
            savedWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="flex mb-4 justify-between items-center bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
                onClick={() => setSelectedWorkout(workout)} // Open modal
              >
                <div>
                  <h4 className="font-bold">{workout.name}</h4>
                  <p>
                    {workout.muscleGroup} - {workout.reps} reps x {workout.sets} sets
                  </p>
                  <p>Saves: {workout.saves} 🌟</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from opening
                    handleUnsaveWorkout(workout);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Unsave
                </button>
              </div>
            ))
          )}
        </div>
      )}

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

export default AccountPage;