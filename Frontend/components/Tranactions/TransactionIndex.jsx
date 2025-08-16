import React from 'react'
import TransactionCard from './TransactionCard'
import Navigator from "../Navigator/Navigator.jsx"
import QuickActions from "../QuickAction/QuickAction.jsx"

const TransactionIndex = () => {
    return (
        <>
        <div>
            <Navigator/>
        </div>
        <div>
            <QuickActions/>
        </div>
            <div className='m-5 p-5 text-bold bg-amber-100 rounded-2xl'>
                <p className='text-3xl font-bold px-5'>Transactions History</p>
                <div>
                    <TransactionCard />
                    <TransactionCard />
                    <TransactionCard />
                </div>
            </div>

        </>
    )
}

export default TransactionIndex
