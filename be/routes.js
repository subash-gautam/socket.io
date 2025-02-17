import e from "express";
import {
	registerUser,
	loginUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
	createAdmin,
} from "./controllers/users.js";

import {
	createMessage,
	deleteChat,
	deleteMessage,
	getChat,
	getMessage,
} from "./controllers/messages.js";

const router = e.Router();

router.get("/", (req, res) => {
	res.send("Hello World");
});

// USER ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", createAdmin);
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// MESSAGE ROUTES
router.post("/message", createMessage);
router.get("/chat", getChat);
router.get("/message/:id", getMessage);
router.delete("/message/:id", deleteMessage);
router.delete("/chat", deleteChat);

// NOTIFICATION ROUTES

export default router;
