import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard.jsx";
import TransactionIndex from "../components/Tranactions/TransactionIndex.jsx";
import ChatBox from "../components/ChatBox/ChatBox.jsx";
import VoiceHandler from "../components/VoiceHandler.jsx";
import ContactsIndex from "../components/Contacts/ContactsIndex.jsx";
import PinModal from "../components/PinModal.jsx";
import Budget from "./Pages/Budget.jsx";   
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionIndex />} />
        <Route path="/contacts" element={<ContactsIndex />} />
        <Route path="/pin" element={<PinModal />} />
        <Route path="/budget" element={<Budget />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
