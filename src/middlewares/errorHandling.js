import logger from "../config/logger.js"

export const erroHandler = (err, req, res, next) => {
    logger.error("Unhandle Error", { err, path: req.path })
    res.status(500).json({ error: "Internal server error" })
}