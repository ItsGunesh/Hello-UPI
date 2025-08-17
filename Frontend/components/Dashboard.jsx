import React,{useState} from 'react'
import Navigator from '../components/Navigator/Navigator.jsx'
import QuickAction from '../components/QuickAction/QuickAction.jsx'
import Balance from '../components/Balance/Balance.jsx'
import ChatBox from '../components/ChatBox/ChatBox.jsx'
import Agent from '../components/AIAgent/Agent.jsx'
import Footer from '../components/Footer/Footer.jsx'
import VoiceHandler from './VoiceHandler.jsx'

const Dashboard = () => {

  const [messages, setMessages] = useState([]);

  const handleCommand = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <>
      <div className='flex flex-col'>
        <Navigator/>
        <Balance/>
        <QuickAction/>
      </div>
      <div className='flex'>
        <VoiceHandler onCommand={handleCommand} />
        <ChatBox messages={messages} />
        <Agent/>
      </div>
      <div>
        <Footer/>
      </div>
    </>
  )
}

export default Dashboard
