import React, { useState } from 'react'
import ConversationList from '../chat/ConversationList'
import MessageView from '../chat/MessageView'
import ChatInput from '../chat/ChatInput'

/**
 * MessagesTab Component
 * Dashboard tab for real-time messaging between buyers and sellers
 */
export default function MessagesTab() {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
  }

  const handleMessageSent = () => {
    // Trigger refresh of conversation list to update last message preview
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-[calc(100vh-200px)] overflow-hidden">
      {/* Conversations List */}
      <div className="lg:col-span-1 overflow-y-auto">
        <h3 className="font-bold text-lg text-kob-dark mb-4 sticky top-0 bg-white py-2 z-10">Messages</h3>
        <ConversationList key={refreshKey} onSelectConversation={handleSelectConversation} />
      </div>

      {/* Chat View */}
      <div className="lg:col-span-2 flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-hidden flex flex-col">
              <MessageView
                conversationId={selectedConversation.id}
                otherParticipantName={selectedConversation.otherParticipantName}
              />
            </div>
            <ChatInput conversationId={selectedConversation.id} onMessageSent={handleMessageSent} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <p className="text-gray-600">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
