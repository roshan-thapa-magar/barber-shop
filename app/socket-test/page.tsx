"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function SocketTest() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io({
      path: "/socket.io/",
      transports: ["websocket", "polling"]
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server:", newSocket.id);
      setIsConnected(true);
      setMessages(prev => [...prev, `Connected: ${newSocket.id}`]);
    });

    newSocket.on("appointment:update", (data) => {
      console.log("Received appointment update:", data);
      setMessages(prev => [...prev, `Appointment update: ${JSON.stringify(data)}`]);
    });

    newSocket.on("appointment:deleted", (data) => {
      console.log("Received appointment deletion:", data);
      setMessages(prev => [...prev, `Appointment deleted: ${JSON.stringify(data)}`]);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
      setMessages(prev => [...prev, "Disconnected"]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setMessages(prev => [...prev, `Connection error: ${error.message}`]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendTestMessage = () => {
    if (socket) {
      socket.emit("appointment:created", { 
        test: true, 
        message: "Test appointment created",
        timestamp: new Date().toISOString()
      });
      setMessages(prev => [...prev, "Sent test message"]);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Socket.IO Test</h1>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Status: <span className={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </p>
        {socket && (
          <p className="text-sm text-gray-600">
            Socket ID: {socket.id}
          </p>
        )}
      </div>

      <button 
        onClick={sendTestMessage}
        disabled={!isConnected}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Send Test Message
      </button>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Messages:</h2>
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="text-sm mb-1">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
