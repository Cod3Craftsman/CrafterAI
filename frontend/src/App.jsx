import { signInWithPopup } from 'firebase/auth'
import React, { useEffect } from 'react'
import { auth , googleProvider } from '../utils/firebase.js'
import api from '../utils/axios.js'
import Home from './pages/Home.jsx'
import getCurrentUser from './features/getCurrentUser.js'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice.js'

function App() {


  const dispatch = useDispatch()

  useEffect(()=>{
    const getUser = async()=>{
      const data = await getCurrentUser()
      dispatch(setUserData(data))
    }
    getUser()
  },[])

  
  return (
    <>
      <Home />
    </>
  )
}

export default App