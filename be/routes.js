import e from "express";
import {
	registerUser,
	loginUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
	createAdmin,
} from "./controllers.js";

const router = e.Router();

router.get("/", (req, res) => {
	res.send("Hello World");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", createAdmin);
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
