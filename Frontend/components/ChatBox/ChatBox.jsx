import React from 'react'

const ChatBox = ({ messages }) => {
  return (
    <div className='w-[50%] h-fit bg-amber-100 rounded-2xl p-5 m-5 box-border'>
      <div className='my-3'>
        <p className='font-bold'>Active Transaction</p>
      </div>
      <div className='h-[80%]'>
        <div className='border-1 h-full p-2 rounded-xl bg-white space-y-2'>
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
