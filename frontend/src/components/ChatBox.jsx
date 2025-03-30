import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const ChatBox = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/message/chat/${selectedUser._id}`,
            { withCredentials: true }
          );
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (input.trim() !== "" && selectedUser) {
      const newMessage = {
        text: input,
        senderId: currentUser?._id?.toString(),
        receiverId: selectedUser._id?.toString(),
      };
  
      try {
        const response = await axios.post(
          `http://localhost:5001/message/chat/${selectedUser._id}`,
          newMessage,
          { withCredentials: true }
        );
  
        // ⚠️ REMOVE THIS LINE TO AVOID DUPLICATION
        // setMessages((prevMessages) => [...prevMessages, response.data.data]);
  
        // ✅ Emit only, state will update from socket listener
        socket.emit("sendMessage", response.data.data);
  
        setInput("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };
  
  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-white p-4 rounded-xl shadow-lg h-full">
      {selectedUser ? (
        <>
          <div className="bg-gray-800 p-3 rounded-t-lg flex items-center gap-3 border-b border-gray-700">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
              {selectedUser.fullName[0].toUpperCase()}
            </div>
            <h3 className="text-lg font-medium">{selectedUser.fullName}</h3>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-800 p-3 rounded-b-lg flex flex-col space-y-2 min-h-[400px]">
            {loading ? (
              <p className="text-gray-400 text-center">Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => {
                const isSentByCurrentUser = msg.senderId === currentUser?._id;
                return (
                  <div
                    key={index}
                    className={`flex w-full ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-2 rounded-lg w-full ${
                        isSentByCurrentUser ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                      }`}
                    >
                      <p className="text-xs text-gray-300">
                        {isSentByCurrentUser ? "You" : msg.senderName}
                      </p>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center">No messages yet</p>
            )}
          </div>
          <div className="flex items-center mt-3 gap-2 h-12">
            <input
              type="text"
              className="flex-1 p-2 rounded-lg text-white outline-none border border-gray-600 focus:border-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-400 text-lg">Select a user to start chat</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;