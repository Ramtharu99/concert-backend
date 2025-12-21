import winston from "winston";
import { MongoDB } from "winston-mongodb";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }), //all logs
        new MongoDB({
            db: process.env.MONGO_URI,
            collection: "logs",
            level: "info"
        }),
    ]
})

export default logger;