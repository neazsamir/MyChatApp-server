import argon2 from 'argon2'


export const hashPassword = async (password) => {
	try {
		return await argon2.hash(password)
	} catch (e) {
		console.log("Error hashing password: ", e)
		return next({ status: 500, success: false, msg: "Internal server error" })
	}
}


export const verifyPassword = async (hash, password) => {
	try {
		return await argon2.verify(hash, password)
	} catch (e) {
		console.log("Error verifying password: ", e)
		return next({ status: 500, success: false, msg: "Internal server error" })
	}
}