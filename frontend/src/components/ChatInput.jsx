import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  Send,
  Zap,
  Plus
} from 'lucide-react'
import React, { useState } from 'react'
import sendMessage from '../features/sendMessage.js'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setLoading, setMessages } from "../redux/messageSlice.js"
import { createConversation } from '../features/createConversation.js'
import {
  addConversation,
  setConvTitle,
  setSelectConversation
} from "../redux/conversationSlice.js"
import { updateConversation } from '../features/updateConversation.js'




function ChatInput() {
  const [value, setValue] = useState("")
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const [showAgents, setShowAgents] = useState(false)

  const handleSendMessage = async () => {
    dispatch(setLoading(true))

    let conversation = selectedConversation

    if (!conversation) {
      const conv = await createConversation()
      dispatch(setMessages([]))
      dispatch(setSelectConversation(conv))
      dispatch(addConversation(conv))
      conversation = conv
    }

    if (conversation.title === "New Chat") {
      await updateConversation({
        id: conversation?._id,
        title: value.trim()
      })

      dispatch(setConvTitle({
        conversationId: conversation?._id,
        title: value.slice(0, 30)
      }))
    }

    const payload = {
      prompt: value,
      conversationId: conversation?._id,
      agent: selectedAgent.toLowerCase()
    }

    dispatch(addMessage({
      role: "user",
      content: value
    }))

    setValue("")

    const data = await sendMessage(payload)

    dispatch(addMessage({
      role: "assistant",
      content: data.answer,
      images: data.images,
      artifacts: data?.artifacts
    }))

    dispatch(setLoading(false))
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
    },
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
      label: "Vision"
    },
    {
      id: "search",
      icon: Globe,
      label: "Search"
    }
  ]

  return (
    <div className="w-full border-t border-white/[0.06] bg-[#0d0f14] px-2 md:px-5 py-2 md:py-4 mb-2 md:mb-5">

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-3 md:px-4 pt-3 md:pt-3.5 pb-2.5 md:pb-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">

        {/* Desktop Agents */}
        <div className="hidden md:flex w-full gap-2 flex-wrap mb-3">

          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label
            const Icon = agent.icon

            return (
              <div
                onClick={() => setSelectedAgent(agent.label)}
                key={agent.label}
                className={`
                  group relative flex items-center gap-2
                  px-3.5 py-2 rounded-xl
                  border cursor-pointer select-none
                  transition-all duration-200
                  backdrop-blur-md
                  ${isActive
                    ? "bg-indigo-500/[0.14] border-indigo-400/30 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.12)]"
                    : "bg-white/[0.025] border-white/[0.06] text-slate-500 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-slate-300"
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
                  <Icon size={15} strokeWidth={1.8} />
                </span>

                <span className="relative text-[12px] font-medium tracking-wide whitespace-nowrap">
                  {agent.label}
                </span>

              </div>
            )
          })}

        </div>

        {/* Message Input */}
        <textarea
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Ask anything..."
          className="w-full h-[55px] md:h-auto bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          rows={2}
        />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between mt-1">

          {/* Mobile Controls */}
          <div className="relative flex md:hidden items-center gap-1">

            {/* Plus Button */}
            <button
              onClick={() => setShowAgents(prev => !prev)}
              className="flex items-center justify-center w-8 h-8 rounded-full
              text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]
              border border-white/[0.06] bg-transparent cursor-pointer"
            >
              <Plus size={18} />
            </button>

            {/* Agent Popup */}
            {showAgents && (
              <div
                className="absolute bottom-10 left-0 z-50 w-52 p-2
                bg-[#151820] border border-white/[0.08] rounded-xl
                shadow-xl flex flex-col gap-1"
              >

                {agents.map((agent) => {
                  const Icon = agent.icon
                  const isActive = selectedAgent === agent.label

                  return (
                    <button
                      key={agent.label}
                      onClick={() => {
                        setSelectedAgent(agent.label)
                        setShowAgents(false)
                      }}
                      className={`
                        flex items-center gap-2.5 w-full
                        px-3 py-2 rounded-lg
                        text-left text-[12px]
                        border-none cursor-pointer
                        ${isActive
                          ? "bg-indigo-500/15 text-indigo-300"
                          : "bg-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                        }
                      `}
                    >
                      <Icon size={15} />
                      {agent.label}
                    </button>
                  )
                })}

              </div>
            )}

            {/* Selected Agent */}
            <span className="text-[12px] text-slate-400 px-2">
              {selectedAgent}
            </span>

          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-1">

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-600 hover:text-slate-400 hover:bg-white/[0.05]
              border border-transparent hover:border-white/[0.06]
              transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Paperclip size={16} />
            </button>

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-600 hover:text-slate-400 hover:bg-white/[0.05]
              border border-transparent hover:border-white/[0.06]
              transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Mic size={16} />
            </button>

          </div>

          {/* Mobile Mic + Send */}
          <div className="flex items-center gap-1">

            <button
              className="flex md:hidden items-center justify-center w-8 h-8
              rounded-full text-slate-500 hover:text-slate-300
              hover:bg-white/[0.05] bg-transparent border-none cursor-pointer"
            >
              <Mic size={17} />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!value}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full
                transition-all duration-200
                ${value
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
                  : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
                }
              `}
            >
              <Send size={15} />
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ChatInput