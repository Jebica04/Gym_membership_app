import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import auth from firebase.js
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth"; // Import deleteUser from Firebase Auth

const UserManagementModule = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedAge, setEditedAge] = useState("");

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

  // Edit user details
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedName(user.name || "");
    setEditedEmail(user.email || "");
    setEditedAge(user.age || "");
  };

  // Save edited user details
  const saveEditedUser = async () => {
    try {
      await updateDoc(doc(db, "users", editingUser.id), {
        name: editedName,
        email: editedEmail,
        age: editedAge ? parseInt(editedAge) : null, // Save age as a number or null if empty
      });
      alert("User updated successfully!");
      setEditingUser(null);
      // Refresh user list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      alert("Error updating user: " + error.message);
    }
  };

  // Delete a user from Firestore and Firebase Authentication
  const handleDeleteUser = async (id, email) => {
    try {
      // Delete user from Firestore
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
      console.log(`Deleted user from Firestore: ${email}`);

      // Delete user from Firebase Authentication
      const userRecord = await auth.getUserByEmail(email); // Get user by email
      await auth.deleteUser(userRecord.uid); // Delete user by UID
      console.log(`Deleted user from Authentication: ${email}`);

      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Error deleting user: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6">User Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Membership</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2 text-left">{user.name}</td>
                <td className="px-4 py-2 text-left">{user.email}</td>
                <td className="px-4 py-2 text-left">{user.age || "N/A"}</td>
                <td className="px-4 py-2 text-left">{user.membership}</td>
                <td className="px-4 py-2 text-left">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <input
              type="text"
              placeholder="Name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="number"
              placeholder="Age"
              value={editedAge}
              onChange={(e) => setEditedAge(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <button
              onClick={saveEditedUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingUser(null)}
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

export default UserManagementModule;