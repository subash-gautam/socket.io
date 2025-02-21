import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import socketHandler from "./middlewares/socketHandlers.js";
import Routes from "./routes.js";

dotenv.config();

const corsOptions = {
	origin: "*",
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });
app.set("io", io);

// socketHandler(io);
io.use(socketHandler(io));

app.use("/api", Routes);

server.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
