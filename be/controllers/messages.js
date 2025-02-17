import prisma from "../prisma/db.config.js";
import { sendEmail } from "../nodemailer.js";

export const createMessage = async (req, res) => {
	const { senderId, receiverId, text } = req.body;

	try {
		const message = await prisma.message.create({
			data: {
				senderId,
				receiverId,
				text,
			},
		});

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
export const getChat = async (req, res) => {
	const { senderId, receiverId } = req.body;
	try {
		const messages = await prisma.message.findMany({
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
		res.json(messages);
	} catch (error) {
		console.log(error);
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
