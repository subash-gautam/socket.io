import { useState, createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
	const socket = useRef(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem("token"); // Get the token

		if (token) {
			socket.current = io("http://localhost:3500", {
				query: { token },
			});

			socket.current.on("connect", () => {
				console.log("Connected to socket.io");
			});

			socket.current.on("disconnect", () => {
				console.log("Disconnected from socket.io");
			});

			socket.current.on("connect_error", (err) => {
				console.error("Socket connection error:", err);
			});

			socket.current.on("user_status", (users) => {
				setOnlineUsers(users);
			});

			return () => {
				if (socket.current) {
					socket.current.disconnect();
				}
			};
		}
	}, []); // Empty dependency array ensures this runs only once

	return (
		<SocketContext.Provider value={{ socket: socket.current, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};
