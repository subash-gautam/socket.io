import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const verifyTokenPromise = (token, secret) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			resolve(decoded);
		});
	});
};

export const authenticateToken = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ error: "Access denied, no token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming jwt.verify uses callbacks
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(400).json({ error: "Session expired !!" }); // consistent return
	}
};

export const authenticateSocket = async (socket, next) => {
	try {
		const token = socket.handshake.query.token; // Extract token from handshake query
		if (!token) {
			throw new Error("No token provided");
		}

		const decoded = await verifyTokenPromise(token, process.env.JWT_SECRET); // Await the promise

		socket.user = decoded; // Attach decoded user to socket
		next();
	} catch (error) {
		console.error("Socket authentication error:", error.message);
		next(new Error("Authentication failed")); // Important: pass error to next()
	}
};
