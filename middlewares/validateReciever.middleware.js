import User from '../models/userSchema.model.js'


const recieverValidator = async (req, res, next) => {
	try {
		const { id} = req.params
		const recieverExists = await User.findById(id)
		if (!recieverExists) next({ status: 404, success: false, msg: "User not found" })
		req.recieverId = id
		next()
	} catch (e) {
		console.log("Error validating reciever: ", e)
		return next(e)
	}
}

export default recieverValidator;