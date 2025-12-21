import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { erroHandler } from './src/middlewares/errorHandling.js';
import { globalRateLimiter } from "./src/middlewares/rateLimit.js";
import routes from "./src/routes/v1/index.js";

const app = express();

app.use(helmet())
app.use(cors({
    origin: "*"
}))
app.use(express.json())

app.use(globalRateLimiter)


app.get('/', (req, res) => {
    res.send("Server is running")
})

app.use('/api', routes)
app.use(erroHandler)
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})