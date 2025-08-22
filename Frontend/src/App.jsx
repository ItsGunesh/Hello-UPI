import { useState } from "react";
import Dashboard from "../components/Dashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionIndex from "../components/Tranactions/TransactionIndex.jsx";

// Import new components
import ChatBox from "../components/ChatBox/ChatBox.jsx";
import VoiceHandler from "../components/VoiceHandler.jsx";
import ContactsIndex from "../components/Contacts/ContactsIndex.jsx";
import PinModal from "../components/PinModal.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionIndex/>}/>
            <Route path="/contacts" element={<ContactsIndex/>}/>
            <Route path="/pin" element={<PinModal/>}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App;
