import { verifyTokenPromise } from "../middlewares/auth.js";
import { setOnlineUsers } from "./socketStates.js";

export default function socketHandler(io) {
	io.use(async (socket, next) => {
		try {
			// console.log("Socket auth: ", socket.handshake.auth);
			const token = socket.handshake.auth.token;
			const decoded = await verifyTokenPromise(
				token,
				process.env.JWT_SECRET,
			);
			socket.user = decoded;
			// console.log("Decoded user via socket:", socket.user);
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
		// console.log(
		// 	"A user connected with token:",
		// 	socket.handshake.auth.token,
		// );

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

		// io.emit("new_notification", {
		// 	userId: socket.user.id,
		// });

		// saving online users
		setOnlineUsers(onlineUsers);

		io.to(socket.user.id).emit("user_status", onlineUsers);

		console.log("onlineUsers:", onlineUsers);
		io.emit("user_status", onlineUsers);

		socket.on("test1", (data) => {
			console.log("test data : ", data);
		});

		socket.emit("test2", "Testing 2 from server");

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
			setOnlineUsers(onlineUsers);

			io.emit("user_status", onlineUsers);
		});
	});
}
