import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

const app = express()

// Middleware order is important - parse body before routes
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// app.use(cors())

// const key_id = process.env.RAZORPAY_KEY_ID
// const key_secret = process.env.RAZORPAY_KEY_SECRET

// console.log(key_id)
// console.log(key_secret)


app.use(express.json());
// app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import dataRouter from "./routes/data.route.js"
import paymentRouter from "./routes/payment.route.js"
import contactRouter from "./routes/contact.route.js"


app.use("/api/data",dataRouter)
app.use("/api/payment",paymentRouter)
app.use("/api/contact",contactRouter)



export {app}