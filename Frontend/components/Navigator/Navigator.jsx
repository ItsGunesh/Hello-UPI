import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { faBars } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Navigator = () => {
  return (
    <>
      <div className='flex justify-between shadow-md box-border w-full py-2 px-6 bg-gradient-to-r from-slate-100 via-slate-100 to-slate-100'>
        <div>
          <p className='test-font text-3xl'>Hello UPI</p>
          <p>{Date().toString}</p>
        </div>
        <div className='flex items-center gap-20'>
          <ul className='flex gap-5 font-bold'>
            {/* <li>Progress</li>
            <li>Gym</li>
            <li>Diet</li> */}
            <li>GO</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Navigator
