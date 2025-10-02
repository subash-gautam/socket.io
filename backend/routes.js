import e from "express";

import {
	registerUser,
	loginUser,
	getUsers,
	getAUser,
	getUserById,
	updateUser,
	deleteUser,
	createAdmin,
} from "./controllers/users.js";

import {
	chatIdList,
	createMessage,
	deleteChat,
	deleteMessage,
	getChat,
	getMessage,
} from "./controllers/messages.js";

import { authenticateToken } from "./middlewares/auth.js";

const router = e.Router();

router.get("/", (req, res) => {
	res.send("Hello World");
});

// USER ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", createAdmin);
router.get("/users", getUsers);
router.get("/user", authenticateToken, getAUser);
router.get("/user/:id", getUserById);
router.put("/user/:id", authenticateToken, updateUser);
router.delete("/user/:id", authenticateToken, deleteUser);

// MESSAGE ROUTES
router.post("/message", authenticateToken, createMessage);
router.get("/chatList", authenticateToken, chatIdList);
router.get("/chat", authenticateToken, getChat);
router.get("/message/:id", getMessage);
router.delete("/message/:id", deleteMessage);
router.delete("/chat", deleteChat);

// NOTIFICATION ROUTES

export default router;
