import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


const ContactCard = ({name,email}) => {
  return (
    <>
      <div className='flex items-center gap-2 bg-slate-800 w-full p-4 py-10 rounded-2xl mt-5'>
        <FontAwesomeIcon icon={faUser} className='text-5xl text-slate-100'/>
        <div className='min-w-0 w-full'>
            <p className='text-2xl font-bold text-slate-200'>{name}</p>
            <p className='text-sm text-slate-200 truncate w-full'>{email}</p>
        </div>
      </div>
    </>
  )
}

export default ContactCard
