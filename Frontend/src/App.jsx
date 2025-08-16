import { useState } from 'react'
import Navigator from '../components/Navigator/Navigator.jsx'
import QuickAction from '../components/QuickAction/QuickAction.jsx'
import Balance from '../components/Balance/Balance.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigator/>
      <QuickAction/>
      <Balance/>
    </>
  )
}

export default App
