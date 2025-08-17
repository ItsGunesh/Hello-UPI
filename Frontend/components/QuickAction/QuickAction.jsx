import React from 'react'
import { useNavigate } from 'react-router-dom' 


const QuickAction = () => {

  const navigate = useNavigate()

  const trans = ()=>{
    navigate("/transactions")
  }
  
  return (
    <>
      <div className='m-5 rounded-xl bg-amber-100 p-5 flex flex-col'>
        <div>
            <p className='font-bold'>Quick Action</p>
        </div>
        <div className='p-4 flex gap-3 '>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p className='font-bold'>Send Money</p>
            </div>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p className='font-bold' onClick={trans}>Transactions</p>
            </div>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p className='font-bold'>Analytics</p>
            </div>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p className='font-bold'>Contacts</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default QuickAction
