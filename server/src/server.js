
import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import wordsRoutes from "./routes/wordsRoutes.js"

import { connectDB } from "./config/db.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use("/api/words", wordsRoutes)

connectDB().then(() => {
    app.listen(5000, () => {
        console.log(`server is listening on port ${PORT}`)
    })
})