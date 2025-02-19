import { verifyTokenPromise } from "../middlewares/auth.js";

export default function socketHandler(io) {
	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.query.token;
			const decoded = await verifyTokenPromise(
				token,
				process.env.JWT_SECRET,
			);
			socket.user = decoded;
			console.log("Decoded user:", socket.user);
			if (!socket.user || !socket.user.id) {
				return next(new Error("Invalid user data"));
			}
			next();
		} catch (err) {
			console.error("Authentication error:", err);
			return next(new Error("Invalid token"));
		}
	});

	io.on("connection", (socket) => {
		console.log(
			"A user connected with token:",
			socket.handshake.query.token,
		);

		if (!socket.user || !socket.user.id) {
			console.error("User data missing after authentication middleware");
			socket.disconnect(true);
			return;
		}

		socket.join(socket.user.id);

		const onlineUsers = Array.from(io.of("/").sockets.values()).map(
			(s) => ({
				userId: s.user.id,
				socketId: s.id,
			}),
		);

		console.log("onlineUsers:", onlineUsers);
		io.emit("user_status", onlineUsers);

		socket.on("test1", (data) => {
			console.log("test data : ", data);
		});

		socket.emit("test2", "Testing");

		socket.on("private_message", (message) => {
			io.to(message.receiverId).emit("private_message", message);
		});

		socket.on("new_chat", (newUser) => {
			io.emit("new_chat", newUser);
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected:", socket.user.id);

			const onlineUsers = Array.from(io.of("/").sockets.values()).map(
				(s) => ({
					userId: s.user.id,
					socketId: s.id,
				}),
			);

			console.log("onlineUsers : ", onlineUsers);

			io.emit("user_status", onlineUsers);
		});
	});
}
