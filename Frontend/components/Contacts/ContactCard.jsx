import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


const ContactCard = ({name,email}) => {
  return (
    <>
      <div className='flex items-center gap-6 bg-slate-800 w-full p-4 py-10 rounded-2xl mt-5'>
        <FontAwesomeIcon icon={faUser} className='text-6xl text-slate-100'/>
        <div>
            <p className='text-3xl font-bold text-slate-200'>{name}</p>
            <p className='text-xl text-slate-200'>{email}</p>
        </div>
      </div>
    </>
  )
}

export default ContactCard
