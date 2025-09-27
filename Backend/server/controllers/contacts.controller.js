import axios from "axios"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// const createQR = async(req,res)=>{
//     const key_id = process.env.RAZORPAY_KEY_ID
//     const key_secret = process.env.RAZORPAY_KEY_SECRET

//     const {name,email,contact} = req.body

//     try {
//         const response = await axios.post("https://api.razorpay.com/v1/contacts",
//             {
//                 name: name,
//                 email: email,
//                 contact: contact,
//                 type: type,
//                 reference_id: "Acme Contact ID 12345",
//                 notes: {
//                     notes_key_1: "Tea, Earl Grey, Hot",
//                     notes_key_2: "Tea, Earl Grey… decaf.",
//                 },
//             },
//             {
//                 auth: {
//                     username: key_id,
//                     password: key_secret,
//                 },
//             }
//         )

//         if(response.status===200){
//             res.status(200).json(
//                 new ApiResponse(200,"Created Contact")
//             )
//         }
//     } catch (error) {
//         throw ApiError(400,"Could not create contact",error)
//     }
// }


const exist = async (req, res) => {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    const { vpaID } = req.body

    console.log(vpaID)

    try {
        const response = await axios.get('https://api.razorpay.com/v1/fund_accounts', {
            auth: {
                username: key_id,
                password: key_secret,
            },
        })

        if (response.status === 200) {
            const contacts = response.data.items

            // console.log(contacts)

            const itExist = contacts.filter(i => {
                if (i.account_type === 'vpa' && i.vpa.address === vpaID && i.active===true) {
                    return true
                }
            })

            console.log(itExist)

            if (itExist.length === 0) {
                res.status(200).json(
                    new ApiResponse(200, false, "Contact Does not exists")
                )
            }
            else {
                res.status(200).json(
                    new ApiResponse(200, true, "Contact exists")
                )
            }
        }
    } catch (error) {
        console.log("Error while checking", error)
        throw new ApiError(error, "Error in contact exist - Backend")
    }


}


const fetchContacts = async (req, res) => {


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

        if (response.status === 200) {
            res.status(200).json(
                new ApiResponse(200, response.data, "Fetched contacts Successfully")
            )
        }
    } catch (error) {
        console.log("Error while fetching code in backend", error)
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.error?.description || "Failed to fetch Contacts"
        )
    }
}

const createContact = async (req, res) => {
    try {
        const { fullName, email, contact, type } = req.body
        // console.log(fullName, email, contact, type)
        // console.log(type)

        const finalEmail = email ? `${email}@gmail.com` : ''

        const key_id = process.env.RAZORPAY_KEY_ID
        const key_secret = process.env.RAZORPAY_KEY_SECRET

        const response = await axios.post("https://api.razorpay.com/v1/contacts",
            {
                name: fullName,
                email: finalEmail,
                contact: contact,
                type: type,
                reference_id: "Acme Contact ID 12345",
                notes: {
                    notes_key_1: "Tea, Earl Grey, Hot",
                    notes_key_2: "Tea, Earl Grey… decaf.",
                },
            },
            {
                auth: {
                    username: key_id,
                    password: key_secret,
                },
            }
        )

        // console.log(response)

        if (response.status === 201) {

            console.log(response.data)

            res.status(200).json(
                new ApiResponse(200, response.data, "Created contact successfully")
            )
        }

        res.status(200).json(
            new ApiResponse(200, response.data, "Check this out")
        )



    } catch (error) {
        // console.log(error)
        throw new ApiError(error.response?.status || 500,
            error.response?.data?.error?.description || "Failed to createContacts")
    }

}

const fundAcc = asyncHandler(async (req, res) => {
    const { contId, vpaID } = req.body

    // console.log(contId,vpaID)

    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    // console.log(key_id)
    // console.log(key_secret)

    try {
        const response = await axios.post(
            'https://api.razorpay.com/v1/fund_accounts',
            {
                account_type: "vpa",
                contact_id: contId,
                vpa: {
                    address: vpaID,
                },
            },
            {
                auth: {
                    username: key_id,
                    password: key_secret,
                },
            }
        );

        // console.log(response)

        if (response.status === 200) {
            res.status(200).json(
                new ApiResponse(200, "Created FundAcc successfully", response.data)
            )
        }
    } catch (error) {
        throw new ApiError(401, "Error creating fund Account", error)
    }
})

export { fetchContacts, createContact, fundAcc, exist }