import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
	console.log(`🔌 New socket connected: ${socket.id}`);

	// Register the user
	socket.on('register', (userId) => {
		if (!userId) return;
		onlineUsers.set(userId.toString(), socket.id);
		console.log(`✅ User registered: ${userId} with socket ${socket.id}`);
		console.log('🟢 Online users:', Array.from(onlineUsers.entries()));
	});

	// Receive and forward a chat message
	socket.on('chat', ({ reciever, sender, text }) => {
		const receiverSocket = onlineUsers.get(reciever?.toString());
		console.log(`📨 Message from ${sender} to ${reciever}: "${text}"`);
		console.log('🟢 Online users:', Array.from(onlineUsers.entries()));

		if (receiverSocket) {
			console.log(`📬 Sending message to socket ${receiverSocket}`);
			io.to(receiverSocket).emit('chat', { sender, text });
		} else {
			console.log(`❌ Receiver ${reciever} is not online`);
		}
	});

	// Seen status handler
	socket.on('seen', ({ sender, reciever }) => {
		const receiverSocket = onlineUsers.get(sender?.toString());
		if (receiverSocket) {
			console.log(`👁️ Seen status from ${reciever} to ${sender}`);
			io.to(receiverSocket).emit('seen', { from: reciever });
		}
	});

	// Cleanup on disconnect
	socket.on('disconnect', () => {
		for (const [userId, socketId] of onlineUsers.entries()) {
			if (socketId === socket.id) {
				onlineUsers.delete(userId);
				console.log(`❎ User ${userId} disconnected and removed from online list`);
				break;
			}
		}
	});
});

export { app, server, io };