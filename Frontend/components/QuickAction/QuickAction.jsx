import React from 'react'

const QuickAction = () => {
  return (
    <>
      <div className='m-5 rounded-xl bg-amber-100 p-5 flex flex-col'>
        <div>
            <p>Quick Action</p>
        </div>
        <div className='p-4 flex gap-3 '>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p>Send Money</p>
            </div>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p>Transaction</p>
            </div>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p>Analytics</p>
            </div>
            <div className='border-1 bg-amber-400 rounded-xl w-[25%] text-center py-5'>
                <p>Contact</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default QuickAction
