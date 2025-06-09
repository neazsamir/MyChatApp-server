import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'


const userSchema = new Schema({
	fullName: {
		required: [true, "Name is required"],
		type: String,
	},
	email: {
		required: [true, "Email is required"],
		unique: true,
		type: String
	},
	password: {
		required: [true, "Password is required"],
		minLength: [6, "Password must be at least 6 chars long"],
		type: String
	},
	avatar: {
		type: String,
		default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs_eI1htWWh9oj8Dif75UM06izEnX0rCzh0Q&usqp=CAU"
	},
	friends: {
		type: Array,
	},
	lastSeen: {
		type: Date,
		default: Date.now()
	}
}, { timestamps: true })



userSchema.methods.generateToken = async function () {
	return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: '7d'
	})
}




const User = model('user', userSchema)


export default User;