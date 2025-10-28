import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import axios from "axios"

const fetchContactId = async(name , contact , Id)=>{
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    // console.log(contact)
    // console.log("Name",name)

    try {
        const response = await axios.get('https://api.razorpay.com/v1/fund_accounts?count=100&skip=0',{
            auth: {
                username: key_id,
                password: key_secret
            }
        })

        const fundAccounts = response.data.items

        // console.log("fund accounts",fundAccounts)

        const matchingFundAccount = fundAccounts.find(c=>{
            if(c.account_type === 'bank_account' && c.bank_account && c.bank_account.name.toLowerCase() === name.toLowerCase()){
                return true
            }
            if(c.account_type === 'vpa' && (c.vpa.username === name || c.vpa.username === contact)){
                return true
            } // optimise here
            if(c.contact_id === Id && c.active){
                return true
            }
            return false
        })

        console.log("matching fund account" , matchingFundAccount)

        return matchingFundAccount


    } catch (error) {
        console.error('Error checking contact:', error);
        return null;
    }
}


const checkContactExists = async (person) => {

    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    // console.log("I am the first in controller")
    
    try {
        const response = await axios.get('https://api.razorpay.com/v1/contacts?count=100&skip=0', {
            auth: {
                username: key_id,
                password: key_secret
            }
        });

        const contacts = response.data.items;

        // console.log("Contacts",contacts)

        // const matchingContact = contacts.filter(c => {
        //     if (c.name.toLowerCase() === person.toLowerCase() && c.active) {
        //         // console.log(c)
        //         return true;
        //     }
        // });
        
        const matchingContact = contacts.find(c => {
            if (c.name.toLowerCase() === person.toLowerCase() && c.active) {
                // console.log(c)
                return true;
            }
        });

        
        // const matchingContact = contacts.filter(c => {
        //     if (c.account_type === 'bank_account' && c.bank_account && c.bank_account.name.toLowerCase() === person.toLowerCase()) {
        //         // console.log(c)
        //         return true;
        //     }
        //     else if (c.account_type === 'wallet' && c.wallet && c.wallet.name.toLowerCase() === person.toLowerCase()) {
        //         return true;
        //     }
        //     else if(c.account_type === 'vpa' ){
        //         // console.log(c)
        //         return true;
        //     }
        //     return false;
        // });

        // console.log(matchingContact)

        return matchingContact;
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

    
    const contacts = await checkContactExists(person);
    // console.log("Matching Contact",contacts)
    if(!contacts){
        return res.status(200).json(
            new ApiResponse(200,"Failed",`No contact named ${person} exists.`)
        )
    }

    const fetchedPerson = contacts.name
    const fetchedId = contacts.id
    const fetchedNumber = contacts.contact.length >10? contacts.contact.slice(3,13) : contacts.contact 
    const contactId = await fetchContactId(fetchedPerson,fetchedNumber,fetchedId);
    // console.log('Contact ID', contactId);

    if (!contactId) {
        return res.status(404).json({ success: false, message: `Contact ${person} does not exist.` });
    }

    const fundAccountId = contactId.id;
    const transactionMode = contactId.account_type === 'vpa' ? 'UPI' : 'NEFT'
    // console.log("amount :" ,amount)

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
                mode: transactionMode,
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
        if(payoutResponse.data.fees===0){
            res.json({
            success: true,
            message: `Insufficient Balance`,
            payoutResponse: payoutResponse.data
        });
        }
        else{
            res.json({
            success: true,
            message: `₹${amount} sent to ${person} successfully.`,
            payoutResponse: payoutResponse.data
        });
        }
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