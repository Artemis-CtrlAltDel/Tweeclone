import mongoose from 'mongoose'

const schema = mongoose.Schema(
    {
        isAdmin: { type: Boolean, default: false },

        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },

        firstname: { type: String, required: true },
        lastname: { type: String, required: true },

        profileimg: String,
        coverimg: String,
        about: String,
        location: String,
        profession: String,
        status: String,

        followers: [],
        following: [],
    },
    {
        timestamps: true
    }
)

const model = mongoose.model('users', schema)

export default model