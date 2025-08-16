import React from 'react'
import TransactionCard from './TransactionCard'

const TransactionIndex = () => {
    return (
        <>
            <div className='m-5 p-5 text-bold bg-amber-100 rounded-2xl'>
                <p className='text-3xl font-bold px-5'>Transactions History</p>
                <div>
                    <TransactionCard />
                </div>
            </div>

        </>
    )
}

export default TransactionIndex
