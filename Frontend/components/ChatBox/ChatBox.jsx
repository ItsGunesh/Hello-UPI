import React from 'react'

const ChatBox = ({ messages }) => {
  return (
    <div className='h-full bg-slate-800 rounded-2xl p-5 m-5 w-full'>
      <div className='my-3'>
        <p className='font-bold text-white text-2xl'>Active Transaction</p>
      </div>
      <div className='h-[80%]'>
        <div className='border-1 h-fit p-2 rounded-xl bg-white space-y-2'>
          {messages.length === 0 ? (
            <p>Say "Hello UPI" to activate!...</p>
          ) : (
            messages.map((msg, i) => (
              <p key={i} className='text-gray-800'>
                {msg}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatBox
