import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, updateDoc, getDoc, setDoc, query, orderBy, limit } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaFire, FaCheckCircle, FaTrophy } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion"; // Import animations
import CountUp from "react-countup"; // Import animated number counter

const ChallengePage = () => {
  const [user] = useAuthState(auth);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // State for leaderboard

  // Fetch today's challenge
  useEffect(() => {
    const fetchDailyChallenge = async () => {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const querySnapshot = await getDocs(collection(db, "challenges"));
      const challenges = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const todayChallenge = challenges.find((challenge) => challenge.date === today);
      setDailyChallenge(todayChallenge);
    };

    fetchDailyChallenge();
  }, []);

  // Fetch user's streak and completed challenges
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (user) {
        const userDocRef = doc(db, "userChallenges", user.email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setStreak(userData.streak || 0);
          setIsCompleted(userData.completedChallenges?.includes(new Date().toISOString().split("T")[0]));
        } else {
          // Initialize user progress if it doesn't exist
          await setDoc(userDocRef, {
            userId: user.email,
            completedChallenges: [],
            streak: 0,
          });
        }
      }
    };

    fetchUserProgress();
  }, [user]);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const usersRef = collection(db, "userChallenges");
      const q = query(usersRef, orderBy("streak", "desc"), limit(5)); // Fetch top 5 users
      const querySnapshot = await getDocs(q);
      const leaderboardData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeaderboard(leaderboardData);
    };

    fetchLeaderboard();
  }, []);

  // Mark challenge as completed
  const handleCompleteChallenge = async () => {
    if (!user || !dailyChallenge) return;

    const today = new Date().toISOString().split("T")[0];
    const userDocRef = doc(db, "userChallenges", user.email);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const completedChallenges = userData.completedChallenges || [];
      const lastCompletedDate = completedChallenges[completedChallenges.length - 1];

      // Calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split("T")[0];

      let newStreak = userData.streak || 0;
      if (lastCompletedDate === yesterdayFormatted) {
        newStreak += 1; // Increment streak if completed yesterday
      } else if (lastCompletedDate !== today) {
        newStreak = 1; // Reset streak if not completed yesterday
      }

      // Update user progress
      await updateDoc(userDocRef, {
        completedChallenges: [...completedChallenges, today],
        streak: newStreak,
      });

      setStreak(newStreak);
      setIsCompleted(true);
      alert("Challenge completat! Tine-o tot asa!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Daily Challenge</h2>

      {/* Challenge Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-lg p-8 max-w-md mx-auto"
      >
        {dailyChallenge ? (
          <>
            {/* Challenge Description */}
            <p className="text-xl mb-6 text-center text-gray-700 font-medium">
              {dailyChallenge.description}
            </p>

            {/* Streak Display */}
            <div className="flex items-center justify-center mb-6">
              <FaFire className="text-red-500 text-3xl mr-2" /> {/* Flame icon */}
              <p className="text-2xl font-bold text-gray-800">
                Streak:{" "}
                <span className="text-blue-600">
                  <CountUp end={streak} duration={1.5} /> {/* Animated number counter */}
                </span>{" "}
                zile
              </p>
            </div>

            {isCompleted ? (
              <div className="flex flex-col items-center justify-center">
                <FaCheckCircle className="text-green-500 text-4xl mb-2" /> {/* Check icon */}
                <p className="text-green-600 text-lg font-semibold">
                  Ai completat challange-ul de azi! 🎉
                </p>
              </div>
            ) : (
              <button
                onClick={handleCompleteChallenge}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Marcheaza ca completat
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-center">Nu exista challenge azi. Incearca maine!</p>
        )}
      </motion.div>

      {/* Streak Leaderboard */}
      <div className="mt-8 bg-white shadow-xl rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Clasament Streak</h3>
        {leaderboard.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Utilizator</th>
                <th className="px-4 py-2 text-left">Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">
                    {index === 0 ? <FaTrophy className="text-yellow-500" /> : index + 1}
                  </td>
                  <td className="px-4 py-2">{user.userId}</td>
                  <td className="px-4 py-2">
                    <CountUp end={user.streak} duration={1.5} /> {/* Animated number counter */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;