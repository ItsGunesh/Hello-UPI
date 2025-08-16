import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const TransactionCard = () => {
    return (
        <>
            <div className='m-5 bg-white rounded-xl flex flex-row justify-between p-2'>
                <div className='flex items-center gap-3'>
                    <div className='rounded-4xl border-1 p-2 bg-green-200 border-green-900'>
                        <FontAwesomeIcon icon={faArrowRight} className='text-2xl text-green-900'/>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-xl font-bold'>NaughtyAmerica</span>
                        <span className='text-lg'>Favorite Site</span>
                        <span className='text-md'>na@amc</span>
                    </div>
                </div>
                <div className='flex flex-col text-right'>
                    <span className='text-2xl font-bold'>+$260</span>
                    <span className='text-sm'>12:03:47</span>
                    <span className='text-sm'>Completed</span>
                </div>
            </div>

        </>
    )
}

export default TransactionCard
