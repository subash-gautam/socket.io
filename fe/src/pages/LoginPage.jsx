import Login from "../components/Auth/Login";

function LoginPage({ token }) {
	if (!token) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Login />
			</div>
		);
	} else {
		window.location.href = "/";
	}
}

export default LoginPage;
