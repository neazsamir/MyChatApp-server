import { Server } from 'socket.io'
import express from 'express'
import http from 'http'


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'https://mychatapp-neaz.netlify.app/'
	}
})

const onlineUsers = new Map()

io.on("connection", (socket) => {
	socket.on("register", (userId) => {
		onlineUsers.set(userId, socket.id)
	})

	socket.on("chat", (payload) => {
		const { reciever, text, sender } = payload
		const receiverSocket = onlineUsers.get(reciever)
		if (receiverSocket) {
			io.to(receiverSocket).emit("chat", { sender, text })
		}
	})
	
	socket.on("seen", ({ sender, reciever }) => {
	const receiverSocket = onlineUsers.get(sender)
	if (receiverSocket) {
		io.to(receiverSocket).emit("seen", { from: reciever })
	}
})

	socket.on("disconnect", () => {
		for (const [userId, sockId] of onlineUsers.entries()) {
			if (sockId === socket.id) {
				onlineUsers.delete(userId)
				break
			}
		}
	})
})


export { app, server, io }