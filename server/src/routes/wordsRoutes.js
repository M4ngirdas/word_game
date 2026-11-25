
import express from "express"

import { getWords, postWord } from "../controllers/wordControllers.js"

const router = express.Router()

router.get("/", getWords)
router.post("/", postWord)

export default router