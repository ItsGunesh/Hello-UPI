import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import axios from "axios"


const checkContactExists = async (person) => {

    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    
    try {
        const response = await axios.get('https://api.razorpay.com/v1/fund_accounts', {
            auth: {
                username: key_id,
                password: key_secret
            }
        });

        const contacts = response.data.items;

        
        const contact = contacts.find(c => {
            if (c.account_type === 'bank_account' && c.bank_account && c.bank_account.name.toLowerCase() === person.toLowerCase()) {
                return true;
            }
            if (c.account_type === 'wallet' && c.wallet && c.wallet.name.toLowerCase() === person.toLowerCase()) {
                return true;
            }
            return false;
        });

        return contact ? contact.id : null;
    } catch (error) {
        console.error('Error checking contact:', error);
        return null;
    }
};


const processPayment = asyncHandler(async(req,res)=>{

    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    
    const {person, amount} = req.body
    // console.log('Extracted person:', person)
    // console.log('Extracted amount:', amount)

    if (!person || !amount) {
        throw new ApiError(400, "Person and amount are required")
    }

    
    const contactId = await checkContactExists(person);
    // console.log('Contact ID:', contactId);

    if (!contactId) {
        return res.status(404).json({ success: false, message: `Contact ${person} does not exist.` });
    }

    const fundAccountId = contactId;
    // console.log("amount :" ,amount)

    // If contact exists, initiate payout
    try {
        const payoutResponse = await axios({
            method: 'POST',
            url: 'https://api.razorpay.com/v1/payouts',
            auth: {
                username: key_id,
                password: key_secret
            },
            data: {
                account_number: process.env.ACCOUNT_NUMBER,
                fund_account_id: fundAccountId,
                amount: amount * 100, 
                currency: 'INR',
                mode: 'NEFT',
                purpose: 'refund',
                queue_if_low_balance: true, 
                reference_id: `Txn-${Date.now()}`, 
                narration: 'Payment Transfer',
                notes: {
                    note1: 'Important note',
                    note2: 'Transaction details'
                }
            }
        });

        // console.log('Payment Response:', payoutResponse.data);
        res.json({
            success: true,
            message: `₹${amount} sent to ${person} successfully.`,
            payoutResponse: payoutResponse.data
        });
    } catch (error) {
        console.error('Error initiating payout:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Transaction failed.', 
            error: error.response ? error.response.data : error.message 
        });
    }
})


export {processPayment}