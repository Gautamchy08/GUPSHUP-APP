import React from 'react'
import { useEffect, useRef } from 'react'

import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkelton from './skelton/MessageSkelton'
import { formatMessageTime } from '../lib/utils'
const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    isMessagesLoading,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    if (selectedUser) {
      console.log('Fetching messages for user:', selectedUser._id)
      getMessages(selectedUser._id)
      subscribeToMessages()
      return () => {
        console.log('Unsubscribing from messages for user:', selectedUser._id)
        unsubscribeFromMessages()
      }
    }
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages
  ])
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkelton />
        <MessageInput />
      </div>
    )
  }
  console.log('user who is here:', authUser)
  messages.map((message, index) => {
    if (message.senderId === authUser._id) {
      console.log(true, 'message from auth user')
    } else {
      console.log(false, 'message from samne wala user')
    }
  })

  return (
    <div className='flex-1 flex flex-col overflow-auto '>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser.user._id ? 'chat-end' : 'chat-start'
            }`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img
                  src={
                    message.senderId === authUser.user._id
                      ? authUser.profilePic || 'avatar.png'
                      : selectedUser.profilePic || 'avatar.png'
                  }
                  alt='profile pic'
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img
                  src={message.image}
                  alt='attachment'
                  className='sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer
