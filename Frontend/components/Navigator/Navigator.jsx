import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navigator = () => {

  const navigate = useNavigate()

  const toHome = ()=>{
    navigate("/")
  }


  return (
    <>
      <div className='flex justify-between shadow-md box-border w-full py-2 px-6 bg-gradient-to-r from-slate-100 via-slate-100 to-slate-100'>
        <div>
          <p className='test-font text-3xl' onClick={toHome}>Hello UPI</p>
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
