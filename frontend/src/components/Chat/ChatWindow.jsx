import { useEffect, useState } from "react";
import backend from "../../config/backend.js";
import Message from "./Message";
import { useSocket } from "../../context/socketContext.jsx";

function ChatWindow({ receiverId }) {
	const { socket } = useSocket(); // ✅ Correct use of hook
	console.log("Receiver ID: ", receiverId);

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch chat history
	useEffect(() => {
		const token = localStorage.getItem("token");
		setLoading(true);
		setError(null);
		setMessages([]);

		fetch(`${backend}/api/chat?receiverId=${receiverId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((err) => {
						throw new Error(
							err.message ||
							`HTTP error! status: ${response.status}`,
						);
					});
				}
				return response.json();
			})
			.then((data) => setMessages(data))
			.catch((error) => {
				console.error("Error fetching messages:", error);
				setError(error.message);
			})
			.finally(() => setLoading(false));
	}, [receiverId]);


	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (message) => {
			// console.log("New message received:", message);
			console.log("sender and chat opened id and message	: ", message.senderId, receiverId, message);
			if (receiverId === message.senderId) {
				setMessages((prev) => [...prev, message]);
			}
		};

		socket.on("new_message", handleNewMessage);

		// ✅ Cleanup listener on unmount or socket change
		return () => {
			socket.off("new_message", handleNewMessage);
		};
	}, [socket, receiverId]);

	const sendMessage = () => {
		const token = localStorage.getItem("token");
		if (!newMessage.trim()) return;

		fetch(`${backend}/api/message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ receiverId, text: newMessage }),
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((err) => {
						throw new Error(
							err.message ||
							`HTTP error! status: ${response.status}`,
						);
					});
				}
				return response.json();
			})
			.then((data) => {
				setMessages((prev) => [...prev, data]);
				setNewMessage("");
				setError(null);
			})
			.catch((error) => {
				console.error("Error sending message:", error);
				setError(error.message);
			});
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "80vh",
				border: "1px solid #ccc",
				borderRadius: "5px",
				padding: "10px",
			}}>
			<div style={{ flex: 1, overflowY: "scroll", padding: "5px" }}>
				{loading && <p>Loading messages...</p>}
				{error && <p style={{ color: "red" }}>{error}</p>}
				{messages.length === 0 && !error && !loading && (
					<p>No messages yet</p>
				)}
				{messages.map((msg, index) => (
					<div
						key={index}
						style={{
							marginBottom: "5px",
							borderRadius: "5px",
							padding: "8px",
							overflow: "auto",
							display: "flex",
							flexDirection: "column-reverse",
							backgroundColor:
								msg.senderId === receiverId
									? "#e0e0e0"
									: "#dcf8c6",
							textAlign:
								msg.senderId === receiverId ? "left" : "right",
						}}>
						<Message message={msg} />
					</div>
				))}
			</div>
			<div style={{ display: "flex", marginTop: "10px" }}>
				<input
					type="text"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							sendMessage();
						}
					}}
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					style={{
						flex: 1,
						padding: "8px",
						border: "1px solid #ccc",
						borderRadius: "3px",
						marginRight: "5px",
					}}
				/>
				<button
					onClick={sendMessage}

					style={{
						padding: "8px 12px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "3px",
						cursor: "pointer",
					}}>
					Send
				</button>
			</div>
		</div>
	);
}

export default ChatWindow;
