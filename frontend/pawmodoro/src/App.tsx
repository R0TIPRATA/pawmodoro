import './App.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home'
import TaskList from './pages/TaskList'
import Sesh from './pages/Sesh'
import Login from './pages/Login'
import Register from './pages/Register'
import RequireAuth from './components/Auth/RequireAuth'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        {/* we want to protect these routes */}
        {/* <Route element={<RequireAuth />}> */}
          <Route path="/" element={<Home />} />
          <Route path="/tasklist/:pageType" element={<TaskList/>} />
          <Route path="/sesh" element={<Sesh/>} />
        {/* </Route> */}
      </Routes>
    </>
  )
}

export default App
