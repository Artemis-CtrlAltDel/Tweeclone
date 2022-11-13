import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

export const getUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await userModel.findById(id)
        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json('User does not exist')
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserIsAdmin, password } = req.body

    if (id === currentUserId || currentUserIsAdmin) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(password, salt)
            }

            const user = await userModel.findByIdAndUpdate(id, req.body, { new: true })
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error.message)
        }
    } else {
        res.status(403).json('Access denied')
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserIsAdmin } = req.body

    if (id === currentUserId || currentUserIsAdmin) {
        try {
            await userModel.findByIdAndDelete(id)
            res.status(200).json('User deleted')
        } catch (error) {
            res.status(500).json(error.message)
        }
    } else {
        res.status(403).json('Access denied')
    }
}

export const followUser = async (req, res) => {
    const id = req.params.id

    const { currentUserId } = req.body
    if (id === currentUserId) {
        res.status(403).json('Action forbidden')
    } else {
        try {
            const followUser = await userModel.findById(id)
            const follower = await userModel.findById(currentUserId)

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $push: { followers: currentUserId } })
                await follower.updateOne({ $push: { following: id } })

                res.status(200).json('User followed')
            } else {
                res.status(403).json('User already followed by you')
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}

export const unfollowUser = async (req, res) => {
    const id = req.params.id

    const { currentUserId } = req.body
    if (id === currentUserId) {
        res.status(403).json('Action forbidden')
    } else {
        try {
            const followUser = await userModel.findById(id)
            const follower = await userModel.findById(currentUserId)

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $pull: { followers: currentUserId } })
                await follower.updateOne({ $pull: { following: id } })

                res.status(200).json('User unfollowed')
            } else {
                res.status(403).json('User is not followed by you')
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}