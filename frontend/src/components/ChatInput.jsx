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
  Plus,
  X
} from 'lucide-react'

import React, { useState, useRef } from 'react'
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

  const { isLoading } = useSelector(state => state.message)

  const [selectedFile, setSelectedFile] = useState(null)
  const fileRef = useRef(null)


  const handleSendMessage = async () => {

    if (!value.trim() && !selectedFile) return
    if (isLoading) return

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


    const formData = new FormData()

    formData.append("prompt", value.trim())
    formData.append("conversationId", conversation?._id)
    formData.append("agent", selectedAgent?.toLowerCase())
    formData.append("file", selectedFile)


    dispatch(addMessage({
      role: "user",
      content: value
    }))


    setValue("")
    setSelectedFile(null)
    fileRef.current.value = ""


    const data = await sendMessage(formData)


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

            const isActive = selectedAgent === agent?.label
            const Icon = agent.icon

            return (

              <button
                onClick={() => setSelectedAgent(agent?.label)}
                disabled={isLoading}
                key={agent?.label}
                className={`
                  group relative flex items-center gap-2
                  px-3.5 py-2 rounded-xl
                  border select-none transition-all duration-200
                  backdrop-blur-md

                  ${isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                  }

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

              </button>




            )
          })}

        </div>


        {/* Selected File */}
        {
          selectedFile && (
            <div className="my-3">

              <div className="flex items-center gap-3 w-fit max-w-sm rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">

                {/* File Preview */}
                <div className="shrink-0">

                  {selectedFile?.type === "application/pdf" ? (

                    <FileText
                      size={20}
                      className="text-red-400"
                    />

                  ) : selectedFile?.type?.startsWith("image/") ? (

                    <img
                      src={URL.createObjectURL(selectedFile)}
                      className="h-10 w-10 rounded-lg object-cover"
                      alt="preview"
                    />

                  ) : null}

                </div>


                {/* File Info */}
                <div className="min-w-0 flex-1">

                  <p className="text-xs text-white truncate">
                    {selectedFile?.name}
                  </p>

                  <p className="text-[10px] text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                </div>


                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    fileRef.current.value = ""
                  }}
                  className="shrink-0 p-1 rounded-md hover:bg-white/10 transition"
                >
                  <X
                    size={14}
                    className="text-red-400 hover:text-red-600"
                  />
                </button>

              </div>

            </div>
          )
        }


        {/* Message Input */}
        <textarea
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {

            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()

              if (!isLoading && (value.trim() || selectedFile)) {
                handleSendMessage()
              }
            }

          }}
          value={value}
          placeholder="Ask anything..."
          disabled={isLoading}
          className={`
            w-full h-[55px] md:h-auto
            bg-transparent outline-none resize-none
            text-[14px] text-slate-200
            placeholder:text-slate-600
            leading-relaxed
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden

            ${isLoading
              ? "cursor-not-allowed opacity-60"
              : ""
            }
          `}
          rows={2}
        />


        {/* File Input */}
        <input
          type="file"
          accept=".pdf,image/*"
          hidden
          ref={fileRef}
          onChange={(e) => {

            const file = e?.target?.files[0]

            if (file) {
              setSelectedFile(file)
            }

          }}
        />


        {/* Bottom Controls */}
        <div className="flex items-center justify-between mt-1">


          {/* Mobile Controls */}
          <div className="relative flex md:hidden items-center gap-1">


            {/* Plus Button */}
            <button
              disabled={isLoading}
              onClick={() => setShowAgents(prev => !prev)}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full
                border border-white/[0.06]
                bg-transparent
                transition-all duration-150

                ${isLoading
                  ? "opacity-50 cursor-not-allowed text-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] cursor-pointer"
                }
              `}
            >
              <Plus size={18} />
            </button>


            {/* Mobile File Upload */}
            <button
              disabled={isLoading}
              onClick={() => fileRef?.current?.click()}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full
                border border-white/[0.06]
                bg-transparent
                transition-all duration-150

                ${isLoading
                  ? "opacity-50 cursor-not-allowed text-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] cursor-pointer"
                }
              `}
            >
              <Paperclip size={16} />
            </button>


            {/* Agent Popup */}
            {showAgents && (

              <div
                className="
                  absolute bottom-10 left-0 z-50
                  w-52 p-2
                  bg-[#151820]
                  border border-white/[0.08]
                  rounded-xl
                  shadow-xl
                  flex flex-col gap-1
                "
              >

                {agents.map((agent) => {

                  const Icon = agent.icon
                  const isActive = selectedAgent === agent.label

                  return (

                    <button
                      key={agent.label}
                      disabled={isLoading}
                      onClick={() => {
                        setSelectedAgent(agent.label)
                        setShowAgents(false)
                      }}
                      className={`
                        flex items-center gap-2.5
                        w-full px-3 py-2
                        rounded-lg
                        text-left text-[12px]
                        border-none

                        ${isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                        }

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


            {/* Desktop File Upload */}
            <button
              disabled={isLoading}
              onClick={() => fileRef?.current?.click()}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-lg
                border border-transparent
                transition-all duration-150

                ${isLoading
                  ? "opacity-50 cursor-not-allowed text-slate-700"
                  : "text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] hover:border-white/[0.06] cursor-pointer"
                }
              `}
            >
              <Paperclip size={16} />
            </button>

          </div>


          {/* Send */}
          <div className="flex items-center gap-1">

            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!value.trim() && !selectedFile)}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full
                transition-all duration-200

                ${!isLoading && (value.trim() || selectedFile)
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