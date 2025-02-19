function Home() {
	const token = localStorage.getItem("token");
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
