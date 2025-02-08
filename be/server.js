import { Server } from "socket.io";
const io = new Server(3000, {
	cors: {
		origin: "http://localhost:8080",
	},
});

io.on("connection", (socket) => {
	console.log(socket.id);

	socket.on("send-message", (message) => {
		console.log(message);
		io.emit("receive-message", message);
	});
});
