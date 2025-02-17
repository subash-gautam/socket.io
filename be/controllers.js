import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./nodemailer.js";

const prisma = new PrismaClient({
	log: ["query"],
});

export const registerUser = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = await prisma.user.create({
			data: {
				role: "USER",
				name,
				email,
				password,
			},
		});
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User does not exist" });
		}
		if (user.password !== password) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: parseInt(id),
			},
		});
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const updateUser = async (req, res) => {
	const { id } = req.params;
	const { name, email, password } = req.body;
	try {
		const user = await prisma.user.update({
			where: {
				id: parseInt(id),
			},
			data: {
				name,
				email,
				password,
			},
		});
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.user.delete({
			where: {
				id: parseInt(id),
			},
		});
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const createAdmin = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const existingAdmin = await prisma.user.findMany({
			where: {
				role: "ADMIN",
			},
		});
		if (existingAdmin.length) {
			return res
				.status(400)
				.json({ message: "This system already has a admin" });
		}

		const user = await prisma.user.create({
			data: {
				role: "ADMIN",
				name,
				email,
				password,
			},
		});

		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
