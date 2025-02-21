import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const newSocket = io("http://localhost:3500", {
			auth: { token: localStorage.getItem("token") },
			transports: ["websocket"], // Force WebSocket
			withCredentials: true, // Ensure cookies & CORS work
		});
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	return useContext(SocketContext);
};
