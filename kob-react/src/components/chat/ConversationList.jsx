import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { getUserConversations } from '../services/chat'
import { useAuth } from '../hooks/useAuth'

/**
 * ConversationList Component
 * Display list of all conversations for current user
 */
export default function ConversationList({ onSelectConversation }) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (!user?.uid) return

    setLoading(true)
    getUserConversations(user.uid)
      .then((data) => {
        setConversations(data)
        setError(null)
      })
      .catch((err) => {
        console.error('Error fetching conversations:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [user?.uid])

  const handleSelectConversation = (conversation) => {
    setSelectedId(conversation.id)
    onSelectConversation(conversation)
  }

  if (loading) {
    return (
      <Card variant="outlined" className="p-6 rounded-lg text-center">
        <div className="text-gray-600">Loading conversations...</div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card variant="outlined" className="p-6 rounded-lg bg-red-50 border-red-200">
        <div className="text-red-700 font-semibold">Error loading conversations</div>
        <p className="text-sm text-red-600 mt-2">{error}</p>
      </Card>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card variant="outlined" className="p-6 rounded-lg text-center">
        <p className="text-gray-600">No active conversations yet</p>
        <p className="text-sm text-gray-500 mt-2">Start a conversation by messaging a seller</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          variant={selectedId === conversation.id ? 'elevated' : 'outlined'}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            selectedId === conversation.id ? 'bg-kob-light border-kob-primary' : 'hover:bg-gray-50'
          }`}
          onClick={() => handleSelectConversation(conversation)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-bold text-kob-dark">
                {conversation.otherParticipantName || `User #${conversation.otherParticipantId?.slice(0, 8)}`}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{conversation.productName}</p>
            </div>

            {/* Unread Badge */}
            {conversation.unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </div>
            )}
          </div>

          {/* Last Message Preview */}
          <p className="text-sm text-gray-700 line-clamp-2 mb-2">{conversation.lastMessage}</p>

          {/* Timestamp */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(conversation.lastMessageTime?.toDate?.() || conversation.lastMessageTime).toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(conversation.lastMessageTime?.toDate?.() || conversation.lastMessageTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
