import React, { useEffect, useRef, useState } from 'react'
import Navigator from '../Navigator/Navigator'
import QuickActions from '../QuickAction/QuickAction'
import ContactCard from './ContactCard'
import axios from 'axios'

const ContactsIndex = () => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL
    const [contacts,setContacts] = useState([])

    const fetchContacts = async()=>{
        try {
            const response = await axios.get(`${apiUrl}/api/contact/fetchcontacts`,{
                withCredentials:true
            })


            if(response.status===200){
                // console.log(response.data.data.items)
                setContacts(response.data.data.items)
            }
        } catch (error) {
            console.log("Error while fetching contacts",error)
        }
    }

    useEffect(()=>{
        fetchContacts()
    },[])

    // console.log(contacts)

    return (
        <>
            <div className='bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 '>
                <div>
                <Navigator />
            </div>
            <div className='mx-[10%]'>
                <QuickActions />
            </div>

            <div className='mx-[10%]'>
                <div className='flex justify-between px-10 items-center bg-white p-5 rounded-2xl'>
                    <p className='text-3xl text-slate-800 font-bold'>Contacts</p>
                    <div className='p-2 w-fit h-fit bg-red-700 text-white rounded-2xl'>
                        {/* <p className='text-xl'>Create Contact</p> */}
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-5 pb-5'>
                    {contacts.map((item,idx)=>(
                        <ContactCard name={item.name} key={idx} email={item.email}/>
                    ))}
                </div>
            </div>
            </div>
        </>
    )
}

export default ContactsIndex
