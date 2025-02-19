import Register from "../components/Auth/Register";

function RegisterPage() {
	const handleRegister = (userInfo) => {
		console.log("Register with:", userInfo);
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Register onRegister={handleRegister} />
		</div>
	);
}

export default RegisterPage;
