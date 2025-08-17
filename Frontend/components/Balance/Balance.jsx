import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

const Balance = () => {

    const [visible,setVisible] = useState(false)

    const togglevisible = ()=>{
        setVisible(!visible)
    }

    return (
        <>
            <div className='m-5 rounded-xl bg-amber-100 py-5 px-10 flex justify-between'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-4 text-center'>
                        <span>Available Balance</span>
                        {visible && <FontAwesomeIcon icon={faEye} onClick={togglevisible}/>}
                        {!visible && <FontAwesomeIcon icon={faEyeSlash} onClick={togglevisible} />}
                    </div>
                    <div>
                        {visible && 
                        <span className='text-4xl font-bold'>$ 69,000</span>}
                        {!visible && 
                        <span className='text-4xl font-bold'>$ ******</span>}
                    </div>
                    <div>
                        <p>UPI ID : girish@ybl</p>
                    </div>
                </div>
                <div className='flex flex-col justify-center'>
                    <FontAwesomeIcon icon={faWallet} className='text-5xl'/>
                </div>
            </div>
        </>
    )
}

export default Balance
