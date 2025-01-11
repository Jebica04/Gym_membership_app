import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, serverTimestamp, query, where, orderBy } from "firebase/firestore";

const ChallengeManagementModule = () => {
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeDate, setChallengeDate] = useState(""); // State for challenge date
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(""); // State for error messages

  // Fetch all challenges and sort them by date
  useEffect(() => {
    const fetchChallenges = async () => {
      const challengesRef = collection(db, "challenges");
      const q = query(challengesRef, orderBy("date", "asc")); // Sort by date in ascending order
      const querySnapshot = await getDocs(q);
      const challengesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChallenges(challengesData);
    };

    fetchChallenges();
  }, []);

  // Add a new challenge
  const handleAddChallenge = async () => {
    if (!challengeDescription || !challengeDate) {
      setError("Please enter a challenge description and select a date.");
      return;
    }

    // Check if a challenge already exists for the selected date
    const challengesRef = collection(db, "challenges");
    const q = query(challengesRef, where("date", "==", challengeDate));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setError("A challenge already exists for the selected date.");
      return;
    }

    try {
      await addDoc(collection(db, "challenges"), {
        date: challengeDate, // Use the selected date
        description: challengeDescription,
        createdAt: serverTimestamp(),
      });
      alert("Challenge added successfully!");
      setChallengeDescription("");
      setChallengeDate("");
      setError("");

      // Refresh the list of challenges
      const querySnapshot = await getDocs(collection(db, "challenges"));
      const challengesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChallenges(challengesData);
    } catch (error) {
      setError("Error adding challenge: " + error.message);
    }
  };

  // Filter challenges to show previous 5, current day, and future challenges (excluding today)
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const pastChallenges = challenges
    .filter((challenge) => challenge.date < today) // Filter past challenges
    .slice(-5); // Get the last 5 past challenges
  const todaysChallenge = challenges.find((challenge) => challenge.date === today); // Find today's challenge
  const futureChallenges = challenges.filter((challenge) => challenge.date > today); // Filter future challenges (excluding today)

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Challenge Management</h3>

      {/* Add Challenge Form */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">Add Daily Challenge</h4>
        <div className="space-y-4">
          <textarea
            placeholder="Enter challenge description"
            value={challengeDescription}
            onChange={(e) => setChallengeDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={challengeDate}
            onChange={(e) => setChallengeDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            min={new Date().toISOString().split("T")[0]} // Restrict to today or future dates
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            onClick={handleAddChallenge}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Challenge
          </button>
        </div>
      </div>

      {/* List of Challenges */}
      <div>
        <h4 className="text-xl font-semibold mb-4">All Challenges</h4>

        {/* Today's Challenge */}
        {todaysChallenge && (
          <div className="mb-8">
            <h5 className="text-lg font-semibold mb-2">Today's Challenge</h5>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-bold">{todaysChallenge.date}</p>
              <p>{todaysChallenge.description}</p>
            </div>
          </div>
        )}

        {/* Past Challenges */}
        <div className="mb-8">
          <h5 className="text-lg font-semibold mb-2">Previous 5 Challenges</h5>
          {pastChallenges.length === 0 ? (
            <p className="text-gray-600">No past challenges found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {pastChallenges.map((challenge) => (
                  <tr key={challenge.id} className="border-b">
                    <td className="px-4 py-2">{challenge.date}</td>
                    <td className="px-4 py-2">{challenge.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Future Challenges */}
        <div>
          <h5 className="text-lg font-semibold mb-2">Future Challenges</h5>
          {futureChallenges.length === 0 ? (
            <p className="text-gray-600">No future challenges found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {futureChallenges.map((challenge) => (
                  <tr key={challenge.id} className="border-b">
                    <td className="px-4 py-2">{challenge.date}</td>
                    <td className="px-4 py-2">{challenge.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeManagementModule;