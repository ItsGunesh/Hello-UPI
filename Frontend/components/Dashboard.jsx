import React, { useState } from 'react'
import Navigator from '../components/Navigator/Navigator.jsx'
import QuickAction from '../components/QuickAction/QuickAction.jsx'
import Balance from '../components/Balance/Balance.jsx'
import ChatBox from '../components/ChatBox/ChatBox.jsx'
import Agent from '../components/AIAgent/Agent.jsx'
import Footer from '../components/Footer/Footer.jsx'
import VoiceHandler from './VoiceHandler.jsx'

const Dashboard = () => {

  const [messages, setMessages] = useState([])
  const [listening, setListening] = useState(false)

  const handleCommand = (msg) => {
    setMessages((prev) => [...prev, msg])
  }

  const handleToggleListening = () => {
    setListening(prev => !prev)
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500">
        <Navigator />

        <main className="flex-grow">
          <div className="mx-[10%] grid grid-cols-[2fr_1fr]">
            <VoiceHandler onCommand={handleCommand} />
            <div>
              <Balance />
            </div>
            <div className="w-full h-full pr-10 pb-10">
              <ChatBox
                messages={messages}
                listening={listening}
                onToggle={handleToggleListening}
              />
            </div>
          </div>

          <div className="mx-[10%] grid grid-cols-3">
            <div className="col-span-2">
              <QuickAction />
            </div>
            <div className="w-full h-full pr-10 pb-10">
              <Agent />
            </div>
          </div>

        </main>

        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>


    </>
  )
}

export default Dashboard
