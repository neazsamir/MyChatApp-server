import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'user',
	},
	recieverId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'user',
	},
	seen: {
		type: Boolean,
		default: false
	},
	text: { type: String },
	image: { type: String }
}, { timestamps: true })



const Message = mongoose.model('message', messageSchema)


export default Message;