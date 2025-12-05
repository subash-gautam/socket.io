import prisma from "../prisma/db.config.js";
import { sendEmail } from "../middlewares/nodemailer.js";
import { getOnlineUsers } from "../middlewares/socketStates.js";

export const createMessage = async (req, res) => {
	const io = req.app.get("socket");
	const senderId = req.user.id;
	const { receiverId, text } = req.body;

	if (receiverId == senderId)
		return res.status(400).json({ error: "Cannot send message to self" });

	try {
		const message = await prisma.message.create({
			data: {
				senderId,
				receiverId,
				text,
			},
		});
		const socketId = getOnlineUsers().find(
			(user) => user.userId === receiverId,
		)?.socketId;

		io.to(socketId).emit("new_message", message);


		// console.log("New message sent to socketId: ", socketId);
		res.json(message);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const getMessage = async (req, res) => {
	const { id } = req.params;
	try {
		const message = await prisma.message.findUnique({
			where: {
				id: parseInt(id),
			},
		});
		res.json(message);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const chatIdList = async (req, res) => {
	console.log("req.user ", req.user)
	const { id } = req.user;
	try {
		const onlineUsers = getOnlineUsers()

		const relationIds = onlineUsers

			.filter((u) => u.userId !== id)

			.map((u) => u.userId);

		res.json({
			userIds: relationIds
		});

	} catch (error) {
		console.error(error); // Use console.error for errors
		res.status(500).json({ message: error.message });
	}
};

export const getChat = async (req, res) => {
	const senderId = req.user.id;
	const { receiverId } = req.query;

	const parsedSenderId = parseInt(senderId);
	const parsedReceiverId = parseInt(receiverId);

	if (isNaN(parsedSenderId) || isNaN(parsedReceiverId)) {
		return res.status(400).json({
			message: "Invalid senderId or receiverId. Must be integers.",
		});
	}

	try {
		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						AND: [
							{ senderId: parsedSenderId },
							{ receiverId: parsedReceiverId },
						],
					},
					{
						AND: [
							{ senderId: parsedReceiverId },
							{ receiverId: parsedSenderId },
						],
					},
				],
			},
			orderBy: {
				createdAt: "asc",
			},
		});
		res.json(messages);
	} catch (error) {
		console.error("Error in getChat:", error); // Use console.error for errors
		res.status(500).json({ message: error.message });
	}
};

export const deleteMessage = async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.message.delete({
			where: {
				id: parseInt(id),
			},
		});
		res.json({ message: "Message deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const deleteChat = async (req, res) => {
	const { senderId, receiverId } = req.body;
	try {
		await prisma.message.deleteMany({
			where: {
				OR: [
					{
						AND: [
							{ senderId: senderId },
							{ receiverId: receiverId },
						],
					},
					{
						AND: [
							{ senderId: receiverId },
							{ receiverId: senderId },
						],
					},
				],
			},
		});
		res.json({ message: "Chat deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
