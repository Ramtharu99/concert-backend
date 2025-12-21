import express from "express";
import concertRouter from "./concertRoutes.js";

const router = express.Router();

router.use("/v1/concert", concertRouter)

export default router;