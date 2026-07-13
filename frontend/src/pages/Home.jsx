import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import api from '../../utils/axios.js'
import { auth, googleProvider } from '../../utils/firebase.js'
import { FcGoogle } from "react-icons/fc";

function Home() {
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }



  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider)
    const token = await data.user.getIdToken()
    await handleLogin(token)
    console.log(data)
  }


  return (
    <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>
      {/* login popup div */}
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'>
        <div className='w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5'>
          <div className='flex flex-col items-center justify-center'>
            <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to CrafterAI</h2>
            <p className='text-[13px] text-slate-500'>Please login to use the app</p>
          </div>


          <button onClick={googleLogin} className='w-full flex items-center justify-center gap-3 bg-white py-[11px] rounded-xl text-black/90 font-medium text-sm hover:bg-gray-200 shadow-lg shadow-indigo-500/30 cursor-pointer transition-all duration-150'>
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
      </div>


    </div>
  )
}

export default Home