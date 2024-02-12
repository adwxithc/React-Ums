import express from 'express'
const app= express()

import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import connectDb from './config/db.js'
import userRoute from './routes/userRoutes.js'
import adminRoute from './routes/adminRoutes.js'

connectDb()


// const corsOptions = {
//   origin: [`${process.env.FRONT_END_URL}`]
// };

// app.use(cors(corsOptions));
app.use(cors())

app.use('/static', express.static('public') )


// PARSING DATA
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser()) 



app.use('/api/users',userRoute)
app.use('/api/admin',adminRoute)

app.use(notFound)
app.use(errorHandler)

const port= process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`server start at port http://localhost:${port}`)
})