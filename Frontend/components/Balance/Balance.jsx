import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faWallet } from '@fortawesome/free-solid-svg-icons';
import axios from "axios"

const Balance = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL

  const [visible, setVisible] = useState(false)
  const [balance, setBalance] = useState(null)

  const toggleVisible = () => {
    setVisible(prev => !prev)
  }

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/data/getbalance`, {
        withCredentials: true
      })

      if (response.status === 200) {
        setBalance(response.data.data.items[0].amount / 100)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 👇 Every time visible changes to true → fetch balance
  useEffect(() => {
    if (visible) {
      fetchBalance()
    }
  }, [visible])

  return (
    <div className='m-5 rounded-xl bg-amber-100 py-5 px-10 flex justify-between'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-4 text-center'>
          <span>Available Balance</span>
          {visible
            ? <FontAwesomeIcon icon={faEye} onClick={toggleVisible} />
            : <FontAwesomeIcon icon={faEyeSlash} onClick={toggleVisible} />}
        </div>
        <div>
          {visible
            ? <span className='text-4xl font-bold'>{balance ?? "Loading..."}</span>
            : <span className='text-4xl font-bold'>$ ******</span>}
        </div>
        <div>
          <p>UPI ID : girish@ybl</p>
        </div>
      </div>
      <div className='flex flex-col justify-center'>
        <FontAwesomeIcon icon={faWallet} className='text-5xl' />
      </div>
    </div>
  )
}

export default Balance
