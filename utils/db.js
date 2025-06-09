import mongoose from 'mongoose'


export const connectDB = async () => {
	const URI = process.env.MONGODB_URI
	try {
		await mongoose.connect(URI)
		console.log("Connected")
	} catch (err) {
		console.error('Error connecting database:', err);
		process.exit()
	}
}