import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const MembershipManagementModule = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState("Basic");
  const [showRenewModal, setShowRenewModal] = useState(false);

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  // Open renew modal and set selected user
  const openRenewModal = (user) => {
    setSelectedUser(user);
    setShowRenewModal(true);
  };

  // Close renew modal
  const closeRenewModal = () => {
    setSelectedUser(null);
    setShowRenewModal(false);
  };

  // Renew or update membership
  const handleRenewMembership = async () => {
    if (!selectedUser || !selectedMembership) {
      alert("Please select a user and membership type.");
      return;
    }

    try {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1); // Renew for 1 month

      await updateDoc(doc(db, "users", selectedUser.id), {
        membership: selectedMembership,
        membershipExpiration: expirationDate,
      });

      alert("Membership renewed successfully!");
      closeRenewModal();

      // Refresh user list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      alert("Error renewing membership: " + error.message);
    }
  };

  // Cancel membership
  const handleCancelMembership = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        membership: "None",
        membershipExpiration: null,
      });

      alert("Membership canceled successfully!");

      // Refresh user list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      alert("Error canceling membership: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Membership Management</h3>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Membership</th>
            <th className="px-4 py-2 text-left">Expiration</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2 text-left">{user.name}</td>
              <td className="px-4 py-2 text-left">{user.email}</td>
              <td className="px-4 py-2 text-left">{user.membership}</td>
              <td className="px-4 py-2 text-left">
                {user.membershipExpiration
                  ? new Date(user.membershipExpiration.toDate()).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-4 py-2 text-left">
                <button
                  onClick={() => openRenewModal(user)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-2"
                >
                  Renew
                </button>
                <button
                  onClick={() => handleCancelMembership(user.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Renew Membership Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Renew Membership</h3>
            <p className="mb-4">
              Renewing membership for: <strong>{selectedUser?.name}</strong>
            </p>
            <select
              value={selectedMembership}
              onChange={(e) => setSelectedMembership(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            >
              <option value="Basic">Basic</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
            <button
              onClick={handleRenewMembership}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Confirm Renewal
            </button>
            <button
              onClick={closeRenewModal}
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

export default MembershipManagementModule;