// imports :
import mongoose from 'mongoose'
import express from 'express'
import { config } from 'dotenv'; config()
import cors from 'cors'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'

// constants :
const PORT = process.env.PORT || 3000
const MONGO = process.env.MONGO
const app = express()

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)))
    .catch((err) => console.log(`Mongodb connection failed, reason : ${err}`))

//routing :
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/post', postRoute)