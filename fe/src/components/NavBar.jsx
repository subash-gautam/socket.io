import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../context/socketContext";

function Navbar() {
	const token = localStorage.getItem("token");

	const { socket } = useSocket();

	// console.log("The socket: ", socket);

	useEffect(() => {
		if (!socket) return;
		socket.on("new_user", (data) => console.log("User data: ", data));
	}, [socket]);

	return (
		<nav
			style={{
				backgroundColor: "#f8f9fa",
				padding: "10px",
				display: "flex",
				justifyContent: "space-around",
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
		</nav>
	);
}

export default Navbar;
