import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { SocketProvider } from "./context/socketContext.jsx";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/NavBar";

function App() {
	const [token, setToken] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		} else {
			navigate("/login"); // Use navigate to redirect
		}
	}, []);

	return (
		<SocketProvider>
			<Navbar token={token} />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/login"
					element={<LoginPage setToken={setToken} />}
				/>
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/chat" element={<ChatPage />} />
				<Route path="/profile" element={<ProfilePage />} />
			</Routes>
		</SocketProvider>
	);
}

export default App;
