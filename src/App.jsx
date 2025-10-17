import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header/Header'
import Home from './components/Home/Home'
import About from './components/About/About'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Activity from './components/Activity/Activity'
import Getevents from './components/Getevents/Getevents'

function App() {
  return (
    <>
      <div>
        <Header></Header>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/about' element={<About></About>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/activity' element={<Activity></Activity>}></Route>
          <Route path='/events' element={<Getevents></Getevents>}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
