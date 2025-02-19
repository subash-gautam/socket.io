import { useState, useEffect } from "react";
import backend from "../config/backend.js";

function ProfilePage() {
	const token = localStorage.getItem("token");
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch(`${backend}/api/user`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});
				console.log(response);

				if (!response.ok) {
					const errorData = await response.json(); // Try to get error details from backend
					throw new Error(
						errorData.message || "Failed to fetch profile data",
					);
				}

				const data = await response.json();
				setUserData(data);
			} catch (err) {
				console.error("Error fetching profile:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (token) {
			// Only fetch if a token exists
			fetchUserData();
		} else {
			setLoading(false); // If no token, not loading
			setError("No token available. Please log in."); // Set error message
		}
	}, [token]); // Add token to the dependency array

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontSize: "1.2em",
				}}>
				Loading profile...
			</div>
		); // Loading indicator
	}

	if (error) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					color: "red",
				}}>
				Error: {error}
			</div>
		); // Error message
	}

	if (userData) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",

					justifyContent: "center",
					padding: "20px",
				}}>
				<h1 style={{ fontSize: "2em", marginBottom: "20px" }}>
					Profile
				</h1>
				<p>
					<strong>Id: </strong>
					{userData.id}
				</p>
				<p>
					<strong>Name:</strong> {userData.name}
				</p>
				<p>
					<strong>Email:</strong> {userData.email}
				</p>
				<p>
					<strong>Role:</strong> {userData.role}
				</p>
				<button
					onClick={() => {
						localStorage.removeItem("token");
						window.location.href = "/";
					}}>
					Logout
				</button>
			</div>
		);
	}

	return null;
}

export default ProfilePage;
