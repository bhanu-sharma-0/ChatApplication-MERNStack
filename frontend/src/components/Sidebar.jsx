import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ setSelectedUser, selectedUser }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/message/users", {
        withCredentials: true,
      });
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="h-screen w-80 bg-gray-900 text-white p-5 shadow-lg border-r border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-5">Users</h2>

      <ul className="space-y-3">
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user?._id}
              className={`p-3 rounded-xl shadow-md flex items-center gap-3 cursor-pointer transition 
                ${
                  selectedUser?._id === user._id
                    ? "bg-blue-950 text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
                {user?.fullName?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="text-lg font-medium">{user?.fullName || "Unknown"}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-400 text-center">No users found</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
