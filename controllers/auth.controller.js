import User from '../models/userSchema.model.js'
import { verifyPassword, hashPassword } from '../models/password.model.js'
import cloudinary from '../utils/cloudinary.js'



export const register = async (req, res, next) => {
	try {
		const { email, fullName, password } = req.body
		const emailExists = await User.findOne({email})
		const hashedPass = await hashPassword(password)
		if (emailExists) return next({status: 409, msg: "Email already exists"})
		
		const newUser = await User.create({ 
			fullName,
			email,
			password: hashedPass
		})
		const user = newUser.toObject()
		delete user.password
		res.cookie('jwt', await newUser.generateToken(), {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			path: '/'
		})
		return res.status(201).json({ success: true, msg: "Account created", data: user })
	} catch (err) {
		console.error('Error in register controller:', err);
		return next({ status: 500, success: false, msg: "Internal server error" })
	}
}

export const login = async (req, res, next) => {
	try {
		const email = req.body?.email?.trim().replaceAll(' ', '').toLowerCase()
		const password = req.body?.password
		if (!email) return next({ status: 400, msg: "Email is required"})
		if (!password) return next({ status: 400, msg: "Password is required"})
		
		const user = await User.findOne({ email })
		
		if (user) {
			const passwordCorrect = await verifyPassword(user.password, password)
			if (passwordCorrect) {
				res.cookie('jwt', await user.generateToken(), {
				maxAge: 7 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'none',
				secure: process.env.NODE_ENV === "production"
				})
				delete user.password
				return res.status(200).json({ success: true, msg: `Welcome back ${user.fullName}`, data:  user })
			} else {
				return next({ status: 400, msg: "Invalid credintials" })
			}
		} else {
				return next({ status: 400, msg: "Invalid credintials" })
			}
		
	} catch (e) {
		console.log('Error logging in user: ', e)
		next(e)
	}
}

export const logout = async (req, res, next) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 })
		return res.json({ success: true, msg: 'Logged out'})
	} catch (e) {
		console.log('Error logging out user: ', e)
		next(e)
	}
}

export const updateProfile = async (req, res, next) => {
	try {
		const userId = req.user._id
		const { avatar } = req.body

		if (!avatar) return next({ status: 400, msg: "Avatar is required" })
		if (avatar === req.user?.avatar) return next({ status: 400, success: false, msg: "Already up-to-date" })

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $set: { avatar } },
			{ new: true }
		)

		return res.json({ success: true, msg: 'Avatar updated' })

	} catch (e) {
		console.log('Error updating profile: ', e)
		next(e)
	}
}

export const checkAuth = async (req, res, next) => {
	try {
		const user = req.user
		
		return res.json({ success: true, user})
		
	} catch (e) {
		console.log('Error checking auth: ', e)
		next(e)
	}
}