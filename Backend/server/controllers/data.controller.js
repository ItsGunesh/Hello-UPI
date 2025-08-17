import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import axios from "axios"

const getBalance = asyncHandler(async (req, res) => {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    
    if (!key_id || !key_secret) {
        throw new ApiError(500, "Razorpay credentials not configured")
    }
    
    
    try {
        const response = await axios.get("https://api.razorpay.com/v1/banking_balances", {
            auth: {
                username: key_id,
                password: key_secret
            }
        });

        // axios automatically parses JSON, no need for response.json()
        const data = response.data;
        
        return res.status(200).json(
            new ApiResponse(200, data, "Balance fetched successfully")
        );

    } catch (error) {
        console.log("Razorpay API Error:", error.response?.data || error.message)
        throw new ApiError(
            error.response?.status || 500, 
            error.response?.data?.error?.description || "Failed to fetch balance"
        )
    }
})

export { getBalance }