import { io } from "socket.io-client";

const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000");
socket.on("connection", () => {
	displayMessage(`You connected with ID: ${socket.id}`);
});

socket.on("receive-message", (message) => {
	displayMessage(message);
});

socket.on("notification", (welcome) => {
	notification(welcome);
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const message = messageInput.value;
	const room = roomInput.value;

	if (message === "") return;
	displayMessage(message);
	socket.emit("send-message", message, room);

	messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
	const room = roomInput.value;

	socket.emit("join-room", room, (message) => {
		displayMessage(message);
	});
});

function displayMessage(message) {
	const div = document.createElement("div");
	div.innerHTML = message;
	document.getElementById("message-container").append(div);
}

const notification = (message) => {
	document.querySelector(".noti").innerHTML = message;
};
