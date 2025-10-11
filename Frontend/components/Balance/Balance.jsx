import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faWallet, faQrcode } from '@fortawesome/free-solid-svg-icons';
import axios from "axios"
import QRCodeScanner from "../QRCodeScanner.jsx"

const Balance = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL

  const [visible, setVisible] = useState(false)
  const [balance, setBalance] = useState(null)
  const [qr, setQr] = useState(false)

  const toggleVisible = () => {
    setVisible(prev => !prev)
  }

  const toggleQr = () => {
    setQr(!qr)
  }

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/data/getbalance`, {
        withCredentials: true
      })

      if (response.status === 200) {
        const INDBalance = new Intl.NumberFormat("en-IN").format(response.data.data.items[0].amount / 100)
        // setBalance(response.data.data.items[0].amount / 100)
        setBalance(INDBalance)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (visible) {
      fetchBalance()
    }
  }, [visible])

  return (
    <>
      <div className='m-5 rounded-xl bg-slate-800 text-white py-12 px-10 flex justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4 text-center'>
            <span>Available Balance</span>
            {visible
              ? <FontAwesomeIcon icon={faEye} onClick={toggleVisible} />
              : <FontAwesomeIcon icon={faEyeSlash} onClick={toggleVisible} />}
          </div>
          <div>
            {visible
              ? <span className='text-4xl font-bold'>{`₹ ${balance}` ?? "Loading..."}</span>
              : <span className='text-4xl font-bold'>₹ ******</span>}
          </div>
          <div>
            <p>UPI ID : psuedogunesh@ybl</p>
          </div>
        </div>
        <div className='flex justify-center items-center gap-5'>
          <FontAwesomeIcon icon={faQrcode} className='text-5xl' onClick={toggleQr} />
          <FontAwesomeIcon icon={faWallet} className='text-5xl' />
        </div>
      </div>
      {qr && <div className="fixed inset-0 flex items-center justify-center z-50">
        <QRCodeScanner/></div>}
    </>
  )
}

export default Balance
