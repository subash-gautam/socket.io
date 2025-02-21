import { useEffect } from "react";
import { useSocket } from "../context/socketContext";

function Home() {
	const token = localStorage.getItem("token");
	const { socket } = useSocket();
	useEffect(() => {
		if (!socket) return;

		socket.emit("test1", "Testing 1 from client, home page loaded");
		// console.log("Socket in home: ", socket);

		const handleTest2 = (data) => console.log(data);
		socket.on("test2", handleTest2);

		// Cleanup the event listener when component unmounts
		return () => {
			socket.off("test2", handleTest2);
		};
	}, [socket]); // Run when `socket` changes

	if (!token) {
		window.location.href = "/login";
	}

	return (
		<>
			<div
				style={{
					margin: "50px auto",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					fontSize: "20px",
					fontWeight: "bold",
				}}>
				Welcome to the Chat App !!
			</div>
			<p
				style={{
					textAlign: "center",
					maxWidth: "80vw",
					margin: "0 auto",
					overflowWrap: "break-word",
				}}>
				user token: {token}
			</p>
		</>
	);
}

export default Home;
