import express from "express"
import dotenv from "dotenv"
import {app} from "./app.js"


// dotenv.config()

dotenv.config({
    path: './.env'
})


const port=process.env.PORT || 8000 

// const key_id = process.env.RAZORPAY_KEY_ID
// const key_secret = process.env.RAZORPAY_KEY_SECRET

// console.log(key_id)
// console.log(key_secret)

app.listen(port, ()=>{
        console.log(`Server listening on port : ${port}`)
    })