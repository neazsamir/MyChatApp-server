 const validatorMiddleware =
(schema) => async (req, res, next) => {
	try {
		const parsedBody = await schema.parseAsync(req.body)
		req.body = parsedBody
		next();
	} catch (err) {
		return next({ msg: err.issues[0].message, status: 400 })
	}
}

export default validatorMiddleware;