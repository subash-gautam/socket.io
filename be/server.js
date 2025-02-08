import { Server } from "socket.io";
const io = new Server(3000, {
	cors: {
		origin: "http://localhost:8080",
	},
});

io.on("connection", (socket) => {
	console.log(socket.id);

	socket.on("send-message", (message, room) => {
		console.log(message, "before room test", room);
		if (room) {
			console.log(message, "in room");
			socket.to(room).emit("receive-message", message);
			return;
		} else {
			console.log(message, "in broadcast");
			socket.broadcast.emit("receive-message", message);
		}
	});
});
