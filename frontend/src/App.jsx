import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Board from './components/board.jsx'
import Vote from './components/vote.jsx'
import './App.css'
import GenKeys from './components/genkey.jsx'
import {Route, Routes, BrowserRouter, Link} from 'react-router-dom'
import Home from './components/home'
 
function App() {
  const [count, setCount] = useState(0)
  const nav = Navigator
  return (
    <>
    <BrowserRouter>
      <div className="flex gap-3">
      <Link to="/castvote">Vote</Link>
      <Link to="/keygen">keygen</Link>
      <Link to="/board">board</Link>

      </div>
      <Routes>
        <Route index element={<Home />} />
        
        <Route path="/board" element={<Board />} />
        <Route path="/castvote" element={<Vote />} />
        <Route path="/keygen" element={<GenKeys />} />
      </Routes>

    </BrowserRouter>
    </>
  )
}

export default App
