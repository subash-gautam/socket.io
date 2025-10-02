import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../context/socketContext";
//File name adjusted...
function Navbar() {
	const token = localStorage.getItem("token");
	const { socket } = useSocket();
	const [notificationCount, setNotificationCount] = useState(0); // State for notification count

	console.log("The socket from navbar: ", socket);

	useEffect(() => {
		if (!socket) return;

		// Listen for new notifications
		socket.on("new_notification", (data) => {
			console.log("New notification: ", data);
			setNotificationCount((prev) => prev + 1); // Increment notification count
		});

		// Existing socket listeners
		socket.on("new_user", (data) => console.log("User data: ", data));
		socket.on("user_status", (data) => console.log("Online users: ", data));

		// Cleanup socket listeners
		return () => {
			socket.off("new_notification");
			socket.off("new_user");
			socket.off("user_status");
		};
	}, [socket]);

	const handleNotificationClick = () => {
		console.log("Notification button clicked");
		setNotificationCount(0);
	};

	return (
		<nav
			style={{
				backgroundColor: "#f8f9fa",
				padding: "10px",
				display: "flex",
				justifyContent: "space-around",
				alignItems: "center",
			}}>
			{token && (
				<Link
					to="/"
					style={{
						textDecoration: "none",
						color: "#333",
						padding: "5px 10px",
						borderRadius: "5px",
					}}>
					Home
				</Link>
			)}
			{!token && (
				<Link
					to="/login"
					style={{
						textDecoration: "none",
						color: "#333",
						padding: "5px 10px",
						borderRadius: "5px",
					}}>
					Login
				</Link>
			)}
			{!token && (
				<Link
					to="/register"
					style={{
						textDecoration: "none",
						color: "#333",
						padding: "5px 10px",
						borderRadius: "5px",
					}}>
					Register
				</Link>
			)}
			{token && (
				<Link
					to="/chat"
					style={{
						textDecoration: "none",
						color: "#333",
						padding: "5px 10px",
						borderRadius: "5px",
					}}>
					Chat
				</Link>
			)}
			{token && (
				<Link
					to="/profile"
					style={{
						textDecoration: "none",
						color: "#333",
						padding: "5px 10px",
						borderRadius: "5px",
					}}>
					Profile
				</Link>
			)}

			{/* Notification Button */}
			{token && (
				<div
					style={{
						position: "relative",
						cursor: "pointer",
					}}
					onClick={handleNotificationClick}>
					<button
						style={{
							backgroundColor: "transparent",
							border: "none",
							cursor: "pointer",
							fontSize: "1.2rem",
						}}>
						🔔
					</button>
					{notificationCount > 0 && (
						<span
							style={{
								position: "absolute",
								top: "-5px",
								right: "-5px",
								backgroundColor: "red",
								color: "white",
								borderRadius: "50%",
								padding: "2px 6px",
								fontSize: "0.8rem",
							}}>
							{notificationCount}
						</span>
					)}
				</div>
			)}
		</nav>
	);
}

export default Navbar;
