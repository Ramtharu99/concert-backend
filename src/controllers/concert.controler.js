import { PrismaClient } from "@prisma/client";
import logger from "../config/logger.js";
import { SINGLE_CONCERT_ID } from './../config/constants.js';

const prisma = new PrismaClient()

export const getConcert = async (req, res) => {
    try {
        console.log("single concert id", SINGLE_CONCERT_ID)
        const concert = await prisma.concert.findFirst({
            where: { id: SINGLE_CONCERT_ID },
            include: { categories: true }
        })

        if (!concert) throw new Error("Concert not found")
        res.json(concert)
    } catch (err) {
        logger.error("get concert error", { err })
        res.status(500).json({ error: err.message })
    }
}