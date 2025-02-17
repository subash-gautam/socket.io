import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";

import socketHandler from "./socketHandlers.js";
import Routes from "./routes.js";

dotenv.config();

const app = express();

app.use(express.json());

const io = new Server(3000, {
	cors: {
		origin: "*",
	},
});

socketHandler(io);

app.use("/api", Routes);

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
