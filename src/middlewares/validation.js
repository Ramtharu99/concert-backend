import logger from "../config/logger.js"

export const validationMiddleware = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        logger.error("validation error", { error })
        res.status(400).json({ error: error.message })
    }
}