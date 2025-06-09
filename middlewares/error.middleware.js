const errMiddleware = (err, req, res, next) => {
	const msg = err.msg || "Internal server error"
	const status = err.status || 500
	console.log(err)
	return res.status(status).json({
		msg,
		success: false
	})
}

export default errMiddleware;