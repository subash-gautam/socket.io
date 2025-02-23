import prisma from "../prisma/db.config.js";
import { getOnlineUsers } from "../middlewares/socketStates.js";

export const saveNotification = async (req, res) => {
	const { userId, title, content, type } = req.body;

	try {
		await prisma.notification.create({
			data: {
				title,
				content,
				type,
				userId,
			},
		});

		const onlineUsers = getOnlineUsers();

		const userSocket = onlineUsers.find(
			(user) => user.userId === userId,
		).socketId;

		if (userSocket) {
			const io = req.app.get("io");
			io.to(userSocket).emit("notification", { title, content, type });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const getNotifications = async (req, res) => {
	try {
		const notifications = await prisma.notification.findMany({
			where: {
				OR: [
					{
						userId: req.user.id,
					},
					{
						type: "all",
					},
				],
			},
		});
		res.json(notifications);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const updateNotificationStatus = async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.notification.update({
			where: {
				id: parseInt(id),
			},
			data: {
				status: "read",
			},
		});
		res.json({ message: "Notification marked as read" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
