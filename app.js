import express from 'express'
import cors from 'cors'
import { connectDB } from './utils/db.js'
import dotenv from 'dotenv'
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/message.routes.js'
import errorMiddleware from './middlewares/error.middleware.js'
import cookieParser from 'cookie-parser'
import { app, server } from './utils/socket.js'


dotenv.config()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['https://mychatapp-neaz.netlify.app'],
  credentials: true
}))
app.use(express.urlencoded({ limit: "10mb" }))
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)
app.use(errorMiddleware)

connectDB()
.then(() => {
	server.listen(PORT, () => console.log('Listening on:', PORT))
})