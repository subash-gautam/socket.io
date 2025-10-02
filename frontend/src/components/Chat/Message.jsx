function Message({ message }) {
	return (
		<div
			style={{
				padding: "10px",
				margin: "5px 0",
				borderBottom: "1px solid #eee",
			}}>
			{" "}
			{/* Container for each message */}
			<p style={{ margin: "0 0 5px 0" }}>{message.text}</p>{" "}
			{/* Message text */}
			<small style={{ color: "#888" }}>
				{new Date(message.createdAt).toLocaleTimeString()}
			</small>{" "}
			{/* Timestamp */}
		</div>
	);
}

export default Message;
