let onlineUsers = [];

export const getOnlineUsers = () => onlineUsers;

export const setOnlineUsers = (users) => {
	onlineUsers = users;
	console.log("Curent onlineUsers:", onlineUsers);
};
