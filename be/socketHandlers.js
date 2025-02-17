export default function socketHandler(io) {
	io.on("connection", (socket) => {
		console.log(socket.id);
		const welcome = `New connection with ID: ${socket.id}`;
		socket.broadcast.emit("notification", welcome);

		socket.on("send-message", (message, room) => {
			// console.log(message, "before room test", room);
			if (room) {
				// console.log(message, "in room");
				socket.to(room).emit("receive-message", message);
				return;
			} else {
				// console.log(message, "in broadcast");
				socket.broadcast.emit("receive-message", message);
			}
		});

		socket.on("join-room", (room, cb) => {
			socket.join(room);
			cb(`Joined room ${room}`);
		});
	});
}
