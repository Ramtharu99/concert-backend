import express from "express";
import authRouters from "./auth.router.js";
import concertRouter from "./concertRoutes.js";

const router = express.Router();

router.use("/v1/concert", concertRouter)
router.use('/v1/auth', authRouters)

export default router;