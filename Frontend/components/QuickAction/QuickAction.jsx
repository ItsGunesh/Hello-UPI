import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons' 
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';


const QuickAction = () => {

  const navigate = useNavigate()

  const trans = ()=>{
    navigate("/transactions")
  }

  const home = ()=>{
    navigate("/")
  }
  
  return (
    <>
      <div className='m-5 rounded-xl bg-white p-5  py-8 flex flex-col'>
        <div>
            <p className='font-bold text-slate-900 text-2xl pl-4'>Quick Action</p>
        </div>
        <div className='p-4 flex gap-3 '>
            <div className='border-1 bg-slate-800 text-slate-100 rounded-xl w-[25%] text-center py-5' onClick={home}>
                <FontAwesomeIcon icon={faPaperPlane} className='text-2xl py-1'/>
                <p className='font-bold' >Send Money</p>
            </div>
            <div className='border-1 bg-slate-800 text-slate-100 rounded-xl w-[25%] text-center py-5' onClick={trans}>
                <FontAwesomeIcon icon={faClockRotateLeft} className='text-2xl py-1'/>
                <p className='font-bold' >Transactions</p>
            </div>
            <div className='border-1 bg-slate-800 text-slate-100 rounded-xl w-[25%] text-center py-5'>
                <FontAwesomeIcon icon={faChartSimple} className='text-2xl py-1'/>
                <p className='font-bold'>Analytics</p>
            </div>
            <div className='border-1 bg-slate-800 text-slate-100 rounded-xl w-[25%] text-center py-5'>
                <FontAwesomeIcon icon={faAddressCard} className='text-2xl py-1'/>
                <p className='font-bold'>Contacts</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default QuickAction
