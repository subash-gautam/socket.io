import { useState } from "react";
import backend from "../../config/backend";

function NewMessage({ onClose, onUserAdded, users }) {
	const [newUserId, setNewUserId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const token = localStorage.getItem("token");

	const handleSendMessage = async () => {
		if (!newUserId) {
			setErrorMessage("User ID is required.");
			return;
		}

		if (users.find((user) => user.id === newUserId)) {
			setErrorMessage("User already exists in your chat list.");
			return;
		}

		try {
			const response = await fetch(`${backend}/api/chat`, {
				// Make sure your backend has this route!
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId: newUserId }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to create chat.");
			}

			// Fetch the new user's data to add to the list
			const userDataResponse = await fetch(
				`${backend}/api/user/${newUserId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!userDataResponse.ok) {
				const errorData = await userDataResponse.json();
				throw new Error(
					errorData.message || "Failed to fetch user data.",
				);
			}

			const newUserData = await userDataResponse.json();
			onUserAdded(newUserData); // Update the user list in the parent
			onClose();
		} catch (error) {
			console.error("Error creating chat:", error);
			setErrorMessage(error.message);
		}
	};

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<div
				style={{
					backgroundColor: "white",
					padding: "20px",
					borderRadius: "5px",
				}}>
				<h2>New Message</h2>
				{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
				<input
					type="text"
					placeholder="Enter User ID"
					value={newUserId}
					onChange={(e) => setNewUserId(e.target.value)}
				/>
				<button onClick={handleSendMessage}>Send</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	);
}

export default NewMessage;
