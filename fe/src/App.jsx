import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { SocketProvider } from "./context/socketContext.jsx";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";

function App() {
	const [token, setToken] = useState(null); // Initialize token to null
	const navigate = useNavigate(); // Hook for navigation

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		} else {
			navigate("/login"); // Use navigate to redirect
		}
	}, []);

	return (
		<>
			<SocketProvider>
				<Navbar token={token} />
				<Routes>
					<Route path="/" element={<Home token={token} />} />
					<Route
						path="/login"
						element={
							<LoginPage token={token} setToken={setToken} />
						}
					/>
					<Route
						path="/register"
						element={<RegisterPage token={token} />}
					/>
					<Route path="/chat" element={<ChatPage token={token} />} />
					<Route
						path="/profile"
						element={<ProfilePage token={token} />}
					/>
				</Routes>
			</SocketProvider>
		</>
	);
}

export default App;
