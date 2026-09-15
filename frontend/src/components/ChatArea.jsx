import React, { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages.js'
import { setArtifacts, setMessages } from '../redux/messageSlice.js'

function ChatArea() {

  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  const { messages } = useSelector(state => state.message)

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation) {
        if (selectedConversation?.title === "New Chat") return;
        const data = await getMessages(selectedConversation?._id)
        dispatch(setMessages(data))
        const latestArtifactMessage = [...data].reverse().find(msg => msg.artifacts && msg.artifacts.length > 0)
        dispatch(setArtifacts(latestArtifactMessage?.artifacts || []))
      }

    }

    getMesg()
  }, [selectedConversation?._id])


  useEffect(() => {
    const latestArtifactMessage = [...messages]
      .reverse()
      .find(msg => msg.artifacts?.length > 0)

    if (latestArtifactMessage) {
      dispatch(setArtifacts(latestArtifactMessage.artifacts))
    }
  }, [messages])


  return (
    <div className='flex-1 flex flex-col'>
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea