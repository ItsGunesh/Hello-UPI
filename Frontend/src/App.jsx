import { useState } from 'react'
import Navigator from '../components/Navigator/Navigator.jsx'
import QuickAction from '../components/Quick Action/QuickAction.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigator/>
      <QuickAction/>
    </>
  )
}

export default App
