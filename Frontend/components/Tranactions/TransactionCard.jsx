import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

const TransactionCard = ({ accountID, fundAccountID, amount, createdAt, status, statusColor, transaction }) => {

    const getTransactionIcon = () => {
        if (status?.toLowerCase() === 'completed') {
            return faArrowRight
        } else if (status?.toLowerCase() === 'pending') {
            return faExchangeAlt
        } else {
            return faArrowLeft
        }
    }

    const getIconColor = () => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'text-green-600 bg-green-100 border-green-300'
            case 'pending':
                return 'text-yellow-600 bg-yellow-100 border-yellow-300'
            case 'failed':
                return 'text-red-600 bg-red-100 border-red-300'
            default:
                return 'text-gray-600 bg-gray-100 border-gray-300'
        }
    }

    return (
        <div className='m-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-row justify-between px-4 py-2'>
            <div className='flex items-center gap-4'>
                <div className={`rounded-full border-2 p-3 ${getIconColor()}`}>
                    <FontAwesomeIcon 
                        icon={getTransactionIcon()} 
                        className='text-xl'
                    />
                </div>
                <div className='flex flex-col'>
                    <span className='text-xl font-bold text-gray-800 '>
                         {accountID}
                    </span>
                    <span className='text-sm text-gray-600'>
                        Fund Account: {fundAccountID}
                    </span>
                    <span className='text-xs text-gray-500 mt-1'>
                        Transaction ID: {transaction?.id || 'N/A'}
                    </span>
                </div>
            </div>
            <div className='flex flex-col items-end text-right'>
                <span className='text-2xl font-bold text-gray-800 mb-1'>
                    {amount}
                </span>
                <span className={`text-sm font-medium ${statusColor} mb-1`}>
                    {status}
                </span>
                <span className='text-xs text-gray-500'>
                    {createdAt}
                </span>
            </div>
        </div>
    )
}

export default TransactionCard
