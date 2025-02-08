import { Server } from "socket.io";
const io = new Server(3000, {
	cors: {
		origin: "http://localhost:8081",
	},
});

io.on("connection", (socket) => {
	console.log(socket.id);
});
