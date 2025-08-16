import { useState } from 'react'
import Navigator from '../components/Navigator/Navigator.jsx'
import QuickAction from '../components/QuickAction/QuickAction.jsx'
import Balance from '../components/Balance/Balance.jsx'
import ChatBox from '../components/ChatBox/ChatBox.jsx'
import Agent from '../components/AIAgent/Agent.jsx'
import Footer from '../components/Footer/Footer.jsx'
import TransactionCard from '../components/Tranactions/TransactionCard.jsx'
import TransactionIndex from '../components/Tranactions/TransactionIndex.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <div className='flex flex-col'>
        <Navigator/>
        <Balance/>
        <QuickAction/>
      </div>
      <div className='flex'>
        <ChatBox/>
        <Agent/>
      </div>
      <div>
        <Footer/>
      </div> */}
      <div>
        <TransactionIndex/>
      </div>
    </>
  )
}

export default App
