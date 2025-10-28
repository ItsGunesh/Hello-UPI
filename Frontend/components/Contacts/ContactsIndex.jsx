import React, { useEffect, useRef, useState } from 'react'
import Navigator from '../Navigator/Navigator'
import QuickActions from '../QuickAction/QuickAction'
import ContactCard from './ContactCard'
import Agent from "../AIAgent/Agent"
import axios from 'axios'
import CreateContact from './CreateContact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import QRCodeScanner from '../QRCodeScanner'

const ContactsIndex = () => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL
    const [contacts, setContacts] = useState([])
    const [createContact, setCreateContact] = useState(false)
    const [qr, setQr] = useState(false)

    const fetchContacts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/contact/fetchcontacts`, {
                withCredentials: true
            })


            if (response.status === 200) {
                // console.log(response.data.data)
                setContacts(response.data.data)
            }
        } catch (error) {
            console.log("Error while fetching contacts", error)
        }
    }

    const update = () => {
        setCreateContact(!createContact)
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    useEffect(() => {

    }, [createContact])

    const toggleQr = () => {
        setQr(!qr)
    }

    return (
        <>
            <div onClick={update}>
                {createContact && <div className='fixed inset-0 backdrop-blur-2xl backdrop-opacity-90 flex justify-center items-center z-50' >
                    <div onClick={(e) => e.stopPropagation()}><CreateContact onSuccess={update} /></div>
                </div>}
            </div>
            <div className='bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 '>
                <div>
                    <Navigator />
                </div>
                <div className='flex flex-row'>
                    <div className='w-[50%] ml-[5%]'>
                        <QuickActions />
                        <Agent/>
                    </div>

                    <div className='m-5 mx-[5%] w-[50%]'>
                        <div className=' flex justify-between px-10 items-center bg-white p-5 rounded-2xl'>
                            <p className='text-3xl text-slate-800 font-bold'>Contacts</p>
                            <div className='flex items-center gap-5 '>
                                <FontAwesomeIcon icon={faQrcode} className='text-4xl' onClick={toggleQr} />
                                <div className='py-2 px-5 w-fit h-fit bg-red-700 text-white rounded-3xl' onClick={update}>
                                    <p className='text-xl'>Create Contact</p>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-3 gap-5 pb-5'>
                            {contacts.map((item, idx) => (
                                <ContactCard name={item.name} key={idx} email={item.email ? item.email : item.contact} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {qr && <div className="fixed inset-0 flex items-center justify-center z-50">
                <QRCodeScanner /></div>}
        </>
    )
}

export default ContactsIndex
