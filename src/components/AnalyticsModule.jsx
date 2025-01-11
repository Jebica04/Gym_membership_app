import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsModule = () => {
  const [users, setUsers] = useState([]);
  const [membershipData, setMembershipData] = useState([]);

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      calculateMembershipDistribution(usersData);
    };
    fetchUsers();
  }, []);

  // Calculate membership distribution
  const calculateMembershipDistribution = (users) => {
    const membershipCounts = {
      Basic: 0,
      Gold: 0,
      Platinum: 0,
    };

    users.forEach((user) => {
      const membership = user.membership;
      const expirationDate = user.membershipExpiration?.toDate();

      // Include only active and non-expired memberships
      if (
        (membership === "Basic" ||
          membership === "Gold" ||
          membership === "Platinum") &&
        (!expirationDate || new Date(expirationDate) >= new Date())
      ) {
        membershipCounts[membership] += 1;
      }
    });

    const totalActiveUsers = Object.values(membershipCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    const membershipPercentages = Object.keys(membershipCounts).map((membership) => ({
      name: membership,
      value: parseFloat(((membershipCounts[membership] / totalActiveUsers) * 100).toFixed(2)),
    }));

    setMembershipData(membershipPercentages);
  };

  // Colors for the pie chart
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      

      {/* Membership Distribution Pie Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Distributia Membership-uri  Active</h3>
        {membershipData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-600">Nu exista date.</p>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Total Useri</h4>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Membership-uri Active</h4>
          <p className="text-2xl font-bold">
            {
              users.filter(
                (user) =>
                  (user.membership === "Basic" ||
                    user.membership === "Gold" ||
                    user.membership === "Platinum") &&
                  (!user.membershipExpiration || new Date(user.membershipExpiration.toDate()) >= new Date())
              ).length
            }
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Membership-uri Expirate</h4>
          <p className="text-2xl font-bold">
            {
              users.filter(
                (user) =>
                  user.membershipExpiration &&
                  new Date(user.membershipExpiration.toDate()) < new Date()
              ).length
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;