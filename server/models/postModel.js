import mongoose from 'mongoose'

const schema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        desc: String,
        image: String,
        likes: [],
    },
    {
        timestamps: true
    }
)

const model = mongoose.model('posts', schema)

export default model