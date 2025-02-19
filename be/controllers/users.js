import prisma from "../prisma/db.config.js";
import { sendEmail } from "../middlewares/nodemailer.js";
import { generateToken } from "../middlewares/auth.js";

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

		sendEmail(
			email,
			"Successful Registration",
			`Hi ${name}, Welcome to our platform homesolution, we are glad to have you here!, You account  is created successfully with id ${user.id}`,
		);
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

		const token = generateToken(user.id, user.role);

		res.json({ message: "Login Success !!", user, token });
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

export const getAUser = async (req, res) => {
	const { id } = req.user;
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

	if (!name && !email && !password) {
		return res
			.status(400)
			.json({ message: "At least one field is required" });
	}

	try {
		const existingEmail = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingUser = await prisma.user.findUnique({
			where: {
				id: parseInt(id),
			},
		});
		if (!existingUser) {
			return res.status(400).json({ message: "User does not exist" });
		}

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
		const existingUser = await prisma.user.findUnique({
			where: {
				id: parseInt(id),
			},
		});
		if (!existingUser) {
			return res.status(400).json({ message: "User does not exist" });
		}

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
