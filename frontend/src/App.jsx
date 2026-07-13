import { signInWithPopup } from 'firebase/auth'
import React, { useEffect } from 'react'
import { auth , googleProvider } from '../utils/firebase.js'
import api from '../utils/axios.js'
import Home from './pages/Home.jsx'
import getCurrentUser from './features/getCurrentUser.js'

function App() {

  useEffect(()=>{
    const getUser = async()=>{
      await getCurrentUser()
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