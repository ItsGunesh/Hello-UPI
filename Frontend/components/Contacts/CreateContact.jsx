import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const CreateContact = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        email: "",
        contact: "",
        fullName: "",
        type: "Self"
    })
    const [errorMessage, setErrorMessage] = useState()
    const [loader, setLoader] = useState(false)

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_BACKEND_URL

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)

        // console.log(formData)

        try {
            const response = await axios.post(`${apiUrl}/api/contact/createcontact`, formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }

            )

            if (response.status === 200 || response.status === 201) {
                onSuccess()
                navigate('/contacts')
            }

            setLoader(false)
        } catch (error) {
            // console.log("Error during signup:", error)
            setLoader(false)
            // if (error.response.data.statusCode === 400) {
            //     setErrorMessage(error.response.data.data)
            // }
            console.log(error)
        }
    }

    const handleNavigate = () => {
        navigate("/login")
    }

    return (
        <>
            <div className='flex flex-col'>
                <form onSubmit={handleSubmit}>
                    <div className='h-fit w-fit bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50 shadow-xl rounded-xl border-gray-400 border-1 px-10 py-5 flex items-center flex-col'>
                        <h1 className='text-center p-4 text-4xl font-bold'>SignUp</h1>
                        <div className='flex flex-col py-2'>
                            <p className='text-left py-1 font-bold'>Enter your email</p>
                            <input type="email" name="email" id="email" onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value })
                            }} className='border-2 bg-white border-gray-400 items-center' />
                        </div>
                        <div className='flex flex-col py-2'>
                            <p className='text-left py-1 font-bold'>Enter your contact number</p>
                            <input type="contact" name="contact" id="contact" onChange={(e) => {
                                setFormData({ ...formData, contact: e.target.value })
                            }} className='border-2 bg-white border-gray-400 items-center' />
                        </div>
                        <div className='flex flex-col py-2'>
                            <p className='text-left py-1 font-bold'>Enter your Fullname</p>
                            <input type="text" name="fullname" id="fullname" onChange={(e) => {
                                setFormData({ ...formData, fullName: e.target.value })
                            }} className='border-2 bg-white border-gray-400 items-center' />
                        </div>
                        <div className='flex flex-col py-2'>
                            <p className='text-left py-1 font-bold'>Select your type</p>
                            <select
                                name="Type"
                                id="Type"
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value })
                                }
                                className="border-2 bg-white border-gray-400 rounded-md px-3 py-2 w-full"
                            >
                                <option value="">Select Type</option>
                                <option value="vendor">Vendor</option>
                                <option value="vustomer">Customer</option>
                                <option value="employee">Employee</option>
                                <option value="self">Self</option>
                            </select>
                        </div>
                        {!loader && <div className='p-2'>
                            <button type="submit" className='font-bold text-xl text-black px-4 py-1 rounded-md hover:transition-transform duration-100 hover:scale-110 hover:text-black'>Create Contact</button>
                        </div>}
                        {/* {loader && <Loader />} */}
                    </div>
                </form>

            </div>

        </>
    )
}


export default CreateContact
