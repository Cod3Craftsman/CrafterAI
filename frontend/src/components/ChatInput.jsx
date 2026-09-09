import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, Paperclip, Presentation, Send, Zap } from 'lucide-react'
import React, { useState } from 'react'
import sendMessage from '../features/sendMessage.js'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setMessages } from "../redux/messageSlice.js"
import { createConversation } from '../features/createConversation.js'
import { addConversation, setConvTitle, setSelectConversation } from "../redux/conversationSlice.js"
import { updateConversation } from '../features/updateConversation.js'





function ChatInput() {
  const [value, setValue] = useState("")
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  const [selectedAgent, setSelectedAgent] = useState("Auto")



  const handleSendMessage = async () => {
    let conversation = selectedConversation
    if (!conversation) {
      const conv = await createConversation()
      dispatch(setMessages([]));
      dispatch(setSelectConversation(conv))
      dispatch(addConversation(conv))
      console.log(conv)
      conversation = conv;
    }

    if (conversation.title === "New Chat") {
      await updateConversation({ id: conversation?._id, title: value.trim() })
      dispatch(setConvTitle({ conversationId: conversation?._id, title: value.slice(0, 30) }))
    }


    const payload = {
      prompt: value,
      conversationId: conversation?._id,
      agent: selectedAgent.toLowerCase()
    }




    dispatch(addMessage({ role: "user", content: value }))
    setValue("")
    const data = await sendMessage(payload)
    dispatch(addMessage({ role: "assistant", content: data }))
    console.log(data)
  }




  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding"
    }
    ,
    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Image"
    },
    {
      id: "search",
      icon: Globe,
      label: "Search"
    }
  ]




  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 mb-5 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">

        {/* Agents */}
        <div className="flex w-full gap-2 flex-wrap">
          {
            agents.map((agent) => {
              const isActive = selectedAgent === agent?.label;
              const Icon = agent?.icon;

              return (
                <div
                  onClick={() => setSelectedAgent(agent?.label)}
                  key={agent?.label}
                  className={`
                  group relative flex items-center gap-2
                  px-3.5 py-2 rounded-xl
                  border cursor-pointer select-none
                  transition-all duration-200 ease-out
                  backdrop-blur-md
                  ${isActive
                      ? `
                        bg-indigo-500/[0.14]
                        border-indigo-400/30
                        text-indigo-300
                        shadow-[0_0_20px_rgba(99,102,241,0.12)]
                      `
                      : `
                        bg-white/[0.025]
                        border-white/[0.06]
                        text-slate-500
                        hover:bg-white/[0.06]
                        hover:border-white/[0.12]
                        hover:text-slate-300
                      `
                    }
                `}
                >

                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-indigo-500/[0.04] pointer-events-none" />
                  )}

                  <span
                    className={`
                    relative flex items-center justify-center
                    w-7 h-7 rounded-lg
                    transition-all duration-200
                    ${isActive
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-white/[0.05] text-slate-500 group-hover:text-slate-300"
                      }
                  `}
                  >
                    {Icon && <Icon size={15} strokeWidth={1.8} />}
                  </span>

                  <span className="relative text-[12px] font-medium tracking-wide whitespace-nowrap">
                    {agent?.label}
                  </span>


                </div>
              )
            })
          }
        </div>

        <textarea
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Ask anything..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={16} />
            </button>

            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={16} />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!value}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${value
              ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 cursor-pointer"
              : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
              }`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput