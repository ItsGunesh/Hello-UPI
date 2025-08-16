import React from 'react'

const Balance = () => {
    return (
        <>
            <div className='m-5 rounded-xl bg-amber-100 p-5 flex justify-between'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-4'>
                        <span>Available Balance</span>
                        <span>Visible Icon</span>
                    </div>
                    <div>
                        <span className='text-4xl'>$ 69,000</span>
                    </div>
                    <div>
                        <p>UPI ID</p>
                    </div>
                </div>
                <div className='flex flex-col justify-center'>
                    <p>Wallet Icon</p>
                </div>
            </div>
        </>
    )
}

export default Balance
