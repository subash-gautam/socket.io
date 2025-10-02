import { useState } from "react";
import { Link } from "react-router-dom";
import backend from "../../config/backend";

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		fetch(`${backend}/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		})
			.then((response) => response.json())
			.then((data) => console.log(data));
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
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Name"
				required
				style={{
					padding: "10px",
					marginBottom: "10px",
					border: "1px solid #ccc",
					borderRadius: "3px",
				}}
			/>
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
					backgroundColor: "#28a745",
					color: "white",
					border: "none",
					borderRadius: "3px",
					cursor: "pointer",
				}}>
				Register
			</button>
			<p>
				Already registered? <Link to="/login">Login</Link>
			</p>
		</form>
	);
}

export default Register;
