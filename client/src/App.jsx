
import { useState, useRef, useEffect } from "react"

import axios from "axios"
import inputsData from "./data/inputs.json"
import keyboardData from "./data/keyboard.json"
import wordsData from "an-array-of-english-words"
import toast, { Toaster } from "react-hot-toast"

export default function App() {

    const [isLoading, setIsLoading] = useState(true)
    const [inputs, setInputs] = useState(inputsData)
    const [words, setWords] = useState(wordsData.filter(word => word.length === 5))
    const [currentWord, setCurrentWord] = useState(null)
    const [currentInputId, setCurrentInputId] = useState(null)
    const [currentRow, setCurrentRow] = useState(1)
    const [currentLetter, setCurrentLetter] = useState(null)
    const [isCurrentInputEmpty, setIsCurrentInputEmpty] = useState(false)

    const inputRefs = useRef([])

    useEffect(() => {
        async function fetchWords() {

            try {
                const response = await axios.get("http://localhost:5000/api/words")
                setCurrentWord(response.data[Math.floor(Math.random() * response.data.length)])
            }
            catch (error) {
                console.error("failed to fetch words")
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchWords()
    }, [])

    useEffect(() => {
        inputs.map(inputsArray => inputsArray.map(input => currentInputId === input.id ? setIsCurrentInputEmpty(input.value.length === 0) : input))
    }, [inputs.map(inputsArray => inputsArray.map(input => input.value))])

    useEffect(() => {
        if (!isLoading) {
            inputRefs.current[1]?.focus()
        }
    }, [isLoading])

    useEffect(() => {
        if (currentRow === 2) inputRefs.current[6]?.focus()
        if (currentRow === 3) inputRefs.current[11]?.focus()
        if (currentRow === 4) inputRefs.current[16]?.focus()
        if (currentRow === 5) inputRefs.current[21]?.focus()
    }, [currentRow])

    function handleSubmit(ev) {
        ev.preventDefault()
        const formData = new FormData(ev.currentTarget)

        const firstInput = formData.get("firstInput")
        const secondInput = formData.get("secondInput")
        const thirdInput = formData.get("thirdInput")
        const fourthInput = formData.get("fourthInput")
        const fifthInput = formData.get("fifthInput")

        const guess = [firstInput, secondInput, thirdInput, fourthInput, fifthInput].join("")

        if (!words.includes(guess)) {
            toast.error("word does not exist")
            return
        }
        // if (guess.slice(0, i) !== currentWord.word.slice(0, i) && currentWord.word.includes(guess.slice(0, 1))) {
        //     setInputs(prev => prev.map(inputsArray => inputsArray.map(input => input.id === i ? { ...input, status: "wrongSpot" } : input)))
        //     console.log("wrong spot")
        // }
        // else if (letter.slice(index, i) === currentWord.word.slice(0, i)) {
        //     console.log("match")
        //     setInputs(prev => prev.map(inputsArray => inputsArray.map(input => input.id === i ? { ...input, status: "matches" } : input)))
        // }
        // else {
        //     console.log("no match")
        //     setInputs(prev => prev.map(inputsArray => inputsArray.map(input => input.id === i ? { ...input, status: "noMatch" } : input)))
        // }

        if (inputs[0][4]?.value.length === 1 && currentRow === 1) setCurrentRow(2)
        if (inputs[1][4]?.value.length === 1 && currentRow === 2) setCurrentRow(3)
        if (inputs[2][4]?.value.length === 1 && currentRow === 3) setCurrentRow(4)
        if (inputs[3][4]?.value.length === 1 && currentRow === 4) setCurrentRow(5)
    }

    function handleType(ev, id) {
        // setInputs(prev => prev.map(inputsArray => inputsArray.map(input => {
        //     if (currentInputId === input.id) {
        //         return { ...input, value: ev.target.value, status: ev.target.value  }
        //     }
        //     else {
        //         return input
        //     }
        // })))
        setInputs(prev => prev.map(inputsArray => inputsArray.map(input => currentInputId === input.id ? { ...input, value: ev.target.value, status: ev.target.value !== currentWord.word.slice(currentInputId - 1, currentInputId) && currentWord.word.includes(ev.target.value) ? "wrongSpot" : ev.target.value === currentWord.word.slice(currentInputId - 1, currentInputId) ? "matches" : "noMatch" } : input)))
        inputRefs.current[id + 1]?.focus()
    }

    function handleDelete(ev, id) {
        setInputs(prev => prev.map(inputsArray => inputsArray.map(input => currentInputId === input.id && ev.key === "Backspace" ? { ...input, value: "" } : input)))
        if (isCurrentInputEmpty && ev.key === "Backspace") inputRefs.current[id - 1]?.focus()
    }

    const inputElements = inputs.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
            {row.map(input => (
                <input
                    key={input.id}
                    type="text"
                    name={`${input.name}Input`}
                    onFocus={() => setCurrentInputId(input.id)}
                    onKeyDown={ev => handleDelete(ev, input.id)}
                    onChange={ev => handleType(ev, input.id)}
                    ref={el => inputRefs.current[input.id] = el}
                    maxLength={1}
                    disabled={currentRow !== rowIndex + 1}
                    className={`${input.status === "matches" ? "bg-green-500" : ""} ${input.status === "wrongSpot" ? "bg-yellow-500" : ""} ${input.status === "noMatch" ? "bg-zinc-300" : ""} caret-transparent uppercase border w-15 h-15 text-3xl text-center`}
                />
            ))}
        </div>
    ))

    const keyboardElements = keyboardData.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
            {row.map((letter, index) => (
                <button onClick={() => setCurrentLetter(letter)} key={index} type="button" className="uppercase w-10 h-10 text-xl bg-zinc-400">{letter}</button>
            ))}
        </div>
    ))

    if (isLoading) {
        return (
            <h1 className="flex justify-center items-center h-screen text-5xl">Loading...</h1>
        )
    }

    return (
        <>
            <main className="flex justify-center items-center gap-12 h-screen">
                <h1>Guess a 5 letter word</h1>
                <form onSubmit={handleSubmit} className="grid gap-6 p-10 bg-gray-100">
                    <div className="grid gap-3">
                        <div className="grid gap-3">{inputElements}</div>
                    </div>
                    <div className="grid gap-4">{keyboardElements}</div>
                    <button type="submit" className="p-2 bg-orange-500 text-white">Guess</button>
                </form>
            </main>
            <Toaster />
        </>
    )
}