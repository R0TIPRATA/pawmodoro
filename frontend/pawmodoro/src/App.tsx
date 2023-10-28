import './App.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home'
import TaskList from './pages/TaskList'
import Sesh from './pages/Sesh'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasklist/:pageType" element={<TaskList/>} />
        <Route path="/sesh" element={<Sesh/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </>
  )
}

export default App
