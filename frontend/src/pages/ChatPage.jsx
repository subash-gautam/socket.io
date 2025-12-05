import backend from "../config/backend";
import { useEffect, useState } from "react";
import ChatWindow from "../components/Chat/ChatWindow";
// import SearchIcon from "@mui/icons-material/Search";

function ChatPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);

	const token = localStorage.getItem("token");
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const initialResponse = await fetch(`${backend}/api/chatList`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				if (!initialResponse.ok) {
					localStorage.removeItem("token");
					window.location.href = "/";
					const errorData = await initialResponse.json();
					throw new Error(
						errorData.message ||
						"Failed to fetch initial user list",
					);
				}

				const initialData = await initialResponse.json();
				console.log("User Ids initial : ", initialData);
				const userIds = initialData.userIds;
				console.log("User Ids : ", userIds);

				const usersData = [];

				for (const userId of userIds) {
					console.log("Related user Id : ", userId);
					const userResponse = await fetch(
						`${backend}/api/user/${userId}`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
						},
					);

					if (!userResponse.ok) {
						localStorage.removeItem("token");
						const errorData = await userResponse.json();
						throw new Error(
							errorData.message ||
							`Failed to fetch user details for ID ${userId}`,
						);
					}

					const userData = await userResponse.json();
					usersData.push(userData);
				}

				setUsers(usersData);
			} catch (err) {
				console.error("Error fetching users:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (token) {
			fetchUsers();
		} else {
			setLoading(false);
			setError("No token si available. Please log in.");
		}
	}, [token]);

	const handleUserClick = (user) => {
		setSelectedUser(user);
	};

	if (loading) {
		return <div>Loading users...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div style={{ display: "flex" }}>
			<div
				style={{
					width: "250px",
					borderRight: "1px solid #ccc",
					overflowY: "auto",
				}}>
				<h2 style={{ padding: "10px" }}>Users</h2>
				{/* <SearchIcon /> */}
				{users.map((user) => (
					<div
						key={user.id}
						style={{
							padding: "10px",
							cursor: "pointer",
							backgroundColor:
								selectedUser?.id === user.id
									? "#e0e0e0"
									: "transparent",
						}}
						onClick={() => handleUserClick(user)}>
						{user.id} {" : "}
						{user.name}
					</div>
				))}
			</div>
			<div style={{ flex: 1, padding: "20px" }}>
				{selectedUser ? (
					<ChatWindow receiverId={selectedUser.id} />
				) : (
					<div>Select a user to start chatting.</div>
				)}
			</div>
		</div>
	);
}

export default ChatPage;
