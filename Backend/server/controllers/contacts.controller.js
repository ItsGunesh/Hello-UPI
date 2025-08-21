import axios from "axios"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const  fetchContacts =async (req,res)=>{

    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    try {
        // console.log("I am controller")
        const response = await axios.get(
            `https://api.razorpay.com/v1/contacts`,
            {
                auth: {
                    username: key_id,
                    password: key_secret,
                },
            }
        );

        if(response.status===200){
            res.status(200).json(
                new ApiResponse(200,response.data,"Fetched contacts Successfully")
            )
        }
    } catch (error) {
        console.log("Error while fetching code in backend" , error)
        throw new ApiError(
            error.response?.status || 500, 
            error.response?.data?.error?.description || "Failed to fetch Contacts"
        )
    }
}

export {fetchContacts}