import { io } from "socket.io-client";

const socket = io("http://localhost:3500");

socket.on("connect", () => {
	console.log("Connected to server!");
	socket.emit("message", "Hello Server");
});

socket.on("message", (msg) => console.log("Received:", msg));
socket.on("disconnect", () => console.log("Disconnected"));
