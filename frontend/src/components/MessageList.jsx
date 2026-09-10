import { Sparkles } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'

function MessageList() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages } = useSelector(state => state.message)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]">

      {messages.length === 0 || !selectedConversation ? (

        <div className="flex flex-col items-center justify-center h-full text-center px-6 ">

          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/5">
            <Sparkles
              className="text-indigo-400"
              size={26}
            />
          </div>

          <h1 className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-3">
            Crafter AI
          </h1>

          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Think deeper. Create better.
          </h2>

          <p className="text-slate-400 max-w-md text-sm leading-6">
            Your intelligent creative partner for ideas, answers, code, and
            everything worth bringing to life.
          </p>

        </div>

      ) : (

        <div className="max-w-4xl mx-auto w-full px-5 sm:px-6 py-8 space-y-5">
          {messages.map((msg, i) => (
            <div
              key={msg?._id || i}
              className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images || [] }
              />
            </div>
          ))}
        </div>

      )}

    </div>
  )
}

export default MessageList