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

const getTransactions = asyncHandler(async (req, res) => {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    const account_number = process.env.ACCOUNT_NUMBER
    
    if (!key_id || !key_secret) {
        throw new ApiError(500, "Razorpay credentials not configured")
    }
    
    if (!account_number) {
        throw new ApiError(500, "Account number not configured")
    }
    
    try {
        const response = await axios.get('https://api.razorpay.com/v1/transactions', {
            auth: {
                username: key_id,
                password: key_secret
            },
            params: {
                account_number: account_number,
            }
        });
        
        console.log('Razorpay API Response:', response.data);

        const data = response.data;
        
        return res.status(200).json(
            new ApiResponse(200, data, "Transactions fetched successfully")
        );

    } catch (error) {
        console.log("Razorpay API Error:", error.response?.data || error.message)
        throw new ApiError(
            error.response?.status || 500, 
            error.response?.data?.error?.description || "Failed to fetch transactions"
        )
    }
})

const fetchName = asyncHandler(async (req, res) => {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    const accountId = req.params.id

    console.log(accountId)

    if (!key_id || !key_secret) {
        throw new ApiError(500, "Razorpay credentials not configured")
    }

    if (!accountId) {
        throw new ApiError(400, "Account ID is required")
    }

    console.log('Fetching name for account ID:', accountId)

    try {
        const response = await axios.get(
            `https://api.razorpay.com/v1/fund_accounts/${accountId}`,
            {
                auth: {
                    username: key_id,
                    password: key_secret,
                },
            }
        );
        
        // console.log('Account details response:', response.data);
        
        return res.status(200).json(
            new ApiResponse(200, response.data, "Account details fetched successfully")
        );
        
    } catch (error) {
        console.log("Error fetching account details:", error.response?.data || error.message)
        throw new ApiError(
            error.response?.status || 500, 
            error.response?.data?.error?.description || "Failed to fetch account details"
        )
    }
})

export { getBalance, getTransactions, fetchName }