import express from "express"
import { getConcert } from "../../controllers/concert.controler.js"

const router = express.Router()

router.get('/', getConcert)

export default router