import React, { useEffect, useState } from 'react'
import { Coins, LogOut, MessageSquare, PanelLeftIcon, PanelRight, PenBoxIcon, PenSquare, Plus, User } from "lucide-react"
import { getConversations } from '../features/getConversations.js'
import { createConversation } from '../features/createConversation.js'
import { useDispatch, useSelector } from "react-redux"
import { setConversations, addConversation, setSelectConversation } from "../redux/conversationSlice.js"
import { setUserData } from "../redux/userSlice.js"
import logOut from '../features/logOut.js'


function SideBar() {



  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useDispatch()
  const { conversations, selectedConversation } = useSelector(state => state.conversation)
  const { userData } = useSelector(state => state.user)
  const [imageError, setImageError] = useState(false)






  // getting conversations
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations()
      dispatch(setConversations(data))
    }

    getConv()
  }, [userData?._id])

  const handleCreateConversation = async () => {
    const data = await createConversation()
    dispatch(addConversation(data))
  }


  const handleLogout = async () => {
    logOut();
    dispatch(setUserData(null))
  }




  if (collapsed) {
    return (
      <div className='hidden md:hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0'>
        <button title='Sidebar' className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1'
          onClick={() => setCollapsed(prev => !prev)}
        >
          <PanelRight />
        </button>


        <button title='New Chat' onClick={()=>dispatch(setSelectConversation(null))}
          className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
        >
          <Plus size={17} />
        </button>




        <div className='p-5 flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv?._id
            return (
              <div key={i} onClick={() => dispatch(setSelectConversation(conv))} className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2 rounded-[10px] border transition-colors duration-150 hover:bg-white/5 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"}`}>


                <div className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
                  <MessageSquare size={13} />
                </div>

              </div>
            )
          })}
        </div>




        {/* avatar div */}
        <div className='relative shrink-0 cursor-pointer' title={userData?.name?.trim().split(/\s+/)[0]}>
          {
            (userData?.avatar && !imageError) ? <img src={userData?.avatar} alt="avatar" onError={() => setImageError(true)} className='w-9 h-9 rounded-full object-cover border-2 border-indigo-500/25' /> : <div className='w-9 h-9 rounded-full object-cover border-2 border-indigo-500/25'><User size={15} className='text-slate-400' /></div>
          }
        </div>
      </div>
    )
  }



  return (
    <div className='fixed lg:static inset-y-0 left- z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06]'>
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-between gap-2.5 px-4 py-4 border-b border-white/[0.06] '>


          {/* open-close sidebar */}
          <div title='Sidebar' className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer' onClick={() => setCollapsed(true)}>
            <PanelLeftIcon />
          </div>


          <span>CrafterAI</span>
          <span className='text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide'>Free</span>

          <button title='New Chat' className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer' onClick={()=>dispatch(setSelectConversation(null))}>
            <PenSquare size={14} />
          </button>
        </div>



        {/* New chat div */}
        <div className='px-4 pt-4 pb-1'>
          <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150'
            onClick={()=>dispatch(setSelectConversation(null))}>
            <Plus size={15} />
            New Chat
          </button>
        </div>



        {/* Conversations div */}
        {conversations.length == 0 ?
          <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>No Recent Conversations</div>

          : (
            <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>Recents</div>
          )}


        <div className='p-5 flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv?._id
            return (
              <div key={i} onClick={() => dispatch(setSelectConversation(conv))} className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2 rounded-[10px] border transition-colors duration-150 hover:bg-white/5 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"}`}>


                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
                  <MessageSquare size={13} />
                </div>

                <span className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}>{conv?.title || "New Chat"}</span>
              </div>
            )
          })}
        </div>




        <div className='mx-2.5 h-px bg-white/[0.6]' />
        {/* footer */}

        <div className='px-3.5 py-3.5'>
          {userData ?
            (<div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150'>

              {/* avatar div */}
              <div className='relative shrink-0'>
                {
                  (userData?.avatar && !imageError) ? <img src={userData?.avatar} alt="avatar" onError={() => setImageError(true)} className='w-9 h-9 rounded-full object-cover border-2 border-indigo-500/25' /> : <div className='w-9 h-9 rounded-full object-cover border-2 border-indigo-500/25'><User size={15} className='text-slate-400' /></div>
                }
              </div>

              <div className='flex-1 min-w-0'>
                <p className='text-[13.5px] font-semibold text-slate-100 truncate'>{userData?.name || "user"}</p>
                <p className='text-[11px] text-slate-600'>{"Free Plan"}</p>
              </div>

              {/* credits and logout */}

              <div className='flex gap-1'>
                <button className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 duration-150 hover:bg-white/[0.08] hover:text-slate-400 transition-all'>
                  <Coins size={16} />
                </button>


                <button className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150' onClick={handleLogout}>
                  <LogOut size={16} />
                </button>

              </div>



            </div>) :
            (<button>Login</button>)}
        </div>


      </div>
    </div>
  )







}

export default SideBar