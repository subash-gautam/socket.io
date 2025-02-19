import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import backend from "../../config/backend";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrorMessage(null); // Clear any previous error messages

		fetch(`${backend}/api/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((err) => {
						throw new Error(err.message || "Login failed"); // Provide a default message
					});
				}
				return response.json();
			})
			.then((data) => {
				if (data.token) {
					localStorage.setItem("token", data.token);
					console.log("Token Stored !!");
					navigate("/");
					window.location.href = "/";
				} else {
					setErrorMessage(data.message || "Invalid credentials");
				}
			})
			.catch((error) => {
				console.error("Login Error:", error);
				setErrorMessage(
					error.message || "An error occurred during login.",
				); // Display error message
			});
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				display: "flex",
				flexDirection: "column",
				width: "300px",
				margin: "20px auto",
				padding: "20px",
				border: "1px solid #ccc",
				borderRadius: "5px",
			}}>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				required
				style={{
					padding: "10px",
					marginBottom: "10px",
					border: "1px solid #ccc",
					borderRadius: "3px",
				}}
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				required
				style={{
					padding: "10px",
					marginBottom: "10px",
					border: "1px solid #ccc",
					borderRadius: "3px",
				}}
			/>
			<button
				type="submit"
				style={{
					padding: "10px",
					backgroundColor: "#007bff",
					color: "white",
					border: "none",
					borderRadius: "3px",
					cursor: "pointer",
				}}>
				Login
			</button>
			{errorMessage && (
				<p style={{ color: "red", marginTop: "10px" }}>
					{errorMessage}
				</p>
			)}
			<p>
				Do not have account? <Link to="/register">Register</Link>
			</p>
		</form>
	);
}

export default Login;
