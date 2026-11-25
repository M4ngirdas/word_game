
import mongoose from "mongoose"

const wordSchema = new mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 5
        },
    }
)

const Word = mongoose.model("Word", wordSchema)
export default Word