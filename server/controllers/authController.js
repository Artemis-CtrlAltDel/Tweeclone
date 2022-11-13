import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

export const registerUser = async (req, res) => {
    const { username, email, password, firstname, lastname } = req.body

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = new userModel(
        {
            username,
            email,
            password: hash,
            firstname,
            lastname
        }
    )

    try {
        await newUser.save()
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email: email })
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            isPasswordValid ? res.status(200).json(user) : res.status(400).json('Wrong password')
        } else {
            res.status(404).json('User does not exist')
        }
    } catch (error) {

    }
}