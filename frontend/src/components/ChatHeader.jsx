import { X } from 'lucide-react'
import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

const ChatHeader = () => {
  const [profilePic, setProfilePic] = useState('/avatar.png')
  const { selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()

  return (
    <div className='p-2.5 border-b border-base-300'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* Avatar */}
          <div className='avatar'>
            <button
              className='size-12 rounded-full overflow-hidden relative '
              onClick={fullProfilePic =>
                setProfilePic(
                  selectedUser.profilePic
                    ? selectedUser.profilePic
                    : '/avatar.png'
                )
              }
            >
              <img
                src={selectedUser.profilePic || '/avatar.png'}
                alt={selectedUser.fullName}
              />
            </button>
          </div>

          {/* User info */}
          <div>
            <h3 className='font-medium'>{selectedUser.fullName}</h3>
            <p className='text-sm text-base-content/70'>
              {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

      {profilePic && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]'>
          <div className='relative max-w-[90vw] max-h-[90vh]'>
            <button
              onClick={() => setProfilePic(false)}
              className='absolute top-2 right-2 text-white bg-black/60 p-1 rounded-full z-[10000]'
            >
              <X size={24} />
            </button>
            <div className='w-full h-full flex items-center justify-center'>
              <img
                src={profilePic}
                alt='Full Profile'
                className='max-w-[95vw] max-h-[95vh] object-contain rounded-xl shadow-xl'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ChatHeader
