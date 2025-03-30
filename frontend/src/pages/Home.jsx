import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";
import ChatBox from "../components/ChatBox.jsx";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch Current User Data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/user/users`, { withCredentials: true });
        console.log("Current User:", response.data);
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error.response?.data || error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch All Users (Except Logged-In User)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/user/users`, { withCredentials: true });
        console.log("Fetched Users:", response.data);

        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Fetch Messages for Selected User
  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/message/chat/${selectedUser._id}`,
          { withCredentials: true }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error);
      }
    };
  
    fetchMessages();
  }, [selectedUser, currentUser]); 
  

  return (
    <div className="w-screen h-screen bg-gray-950 flex justify-center items-center px-6 py-3">
      <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full h-[calc(100vh-4rem)] border border-gray-700/50">
        <div className="flex h-full rounded-lg overflow-hidden">
          <Sidebar users={users} setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
          <ChatBox selectedUser={selectedUser} currentUser={currentUser} messages={messages} /> 
        </div>
      </div>
    </div>
  );
};

export default Home;
