
import Word from "../models/Word.js"

export async function getWords(req, res) {
    try {
        const words = await Word.find()
        res.status(200).json(words)
    }
    catch (error) {
        console.error("error in getWords controller", error)
        res.status(500).json({ message: "internal server error" })
    }
}

export async function postWord(req, res) {
    try {
        const { word } = req.body
        const newWord = new Word({ word })
        const savedWord = await newWord.save()
        res.status(201).json(savedWord)
    } catch (error) {
        console.error("error in postWord controller", error)
        res.status(500).json({ message: "internal server error" })
    }
}