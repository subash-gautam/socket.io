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
	const { id } = req.user;
	try {
		// const messages = await prisma.message.findMany({
		// 	where: {
		// 		OR: [{ receiverId: id }, { senderId: id }],
		// 	},
		// 	select: {
		// 		receiverId: true,
		// 		senderId: true,
		// 	},
		// });
		// const userIds = new Set();
		// messages.forEach((message) => {
		// 	userIds.add(message.receiverId);
		// 	userIds.add(message.senderId);
		// });
		// const uniqueUserIds = Array.from(userIds);
		// // Correct way to filter out the current user's ID
		// const relationIds = uniqueUserIds.filter((userId) => userId !== id);
		// res.json({ userIds: relationIds });
		const ids = await prisma.user.findMany({
			where: {
				id: {
					not: Number(id),
				},
			},
			select: {
				id: true,
			},
		});
		res.json({ userIds: ids.map((u) => u.id) });
	} catch (error) {
		console.error(error); // Use console.error for errors
		res.status(500).json({ message: error.message });
	}
};

export const getChat = async (req, res) => {
	const senderId = req.user.id;
	const { receiverId } = req.query;

	console.log("senderId:", typeof senderId, senderId);
	console.log("receiverId:", typeof receiverId, receiverId);
	console.log("req.query:", req.query);
	console.log("req.user:", req.user);

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
