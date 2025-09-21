import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import axios from "axios"

const extract = asyncHandler(async(req,res)=>{
    const {sentence} = req.body

    // console.log(sentence)

    if (!sentence) {
    return res.status(400).json({ error: "sentence is required" });
  }

  const pythonServerURL = process.env.PY_URL
  console.log(pythonServerURL)

    try {
        const response = await axios.post(`${pythonServerURL}/extract`,{sentence},{
            headers: { 
                "Content-Type": "application/json" 
            } })

            if(response.status==200){
                res.status(200).json(
                    new ApiResponse(200,response.data,"Extraction successfull")
            )
            }

    } catch (error) {
        console.log(error)
        throw new ApiError(401,"Backend - Extraction issue")
    }
})

export {extract}