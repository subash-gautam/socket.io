import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import backend from "../config/backend";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const newSocket = io(backend, {
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
