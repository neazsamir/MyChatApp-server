import User from '../models/userSchema.model.js'
import jwt from 'jsonwebtoken'



export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt
		
		if (!token) {
			return next({ status: 401, success: false, msg: "Unauthorized - token not provided" })
		}
		
		const isAuthorized = await jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findOne({_id:isAuthorized?.id}).select({password: 0})
		if (!isAuthorized || !user?.email) {
			return next({status: 404, msg: "Unauthorized - user not found"})
		}
		req.user = user
		next()
	} catch (e) {
		console.log('Error protecting route: ', e)
		next(e)
	}
}