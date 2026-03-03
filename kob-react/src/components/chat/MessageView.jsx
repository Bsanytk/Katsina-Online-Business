import React, { useState, useEffect, useRef } from 'react'
import { Card } from '../ui'
import { subscribeToMessages, markMessagesAsRead } from '../services/chat'
import { useAuth } from '../hooks/useAuth'

/**
 * MessageView Component
 * Display real-time message thread for a conversation
 */
export default function MessageView({ conversationId, otherParticipantName }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const unsubscribeRef = useRef(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || !user?.uid) return

    setLoading(true)
    unsubscribeRef.current = subscribeToMessages(conversationId, (data) => {
      setMessages(data)
      setError(null)
      setLoading(false)

      // Mark messages as read
      markMessagesAsRead(conversationId, user.uid).catch((err) => {
        console.error('Error marking messages as read:', err)
      })
    })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [conversationId, user?.uid])

  if (!conversationId) {
    return (
      <Card variant="outlined" className="p-8 rounded-lg text-center h-full flex items-center justify-center">
        <p className="text-gray-600">Select a conversation to view messages</p>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card variant="outlined" className="p-8 rounded-lg text-center h-full flex items-center justify-center">
        <p className="text-gray-600">Loading messages...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card variant="outlined" className="p-6 rounded-lg bg-red-50 border-red-200 h-full">
        <div className="text-red-700 font-semibold">Error loading messages</div>
        <p className="text-sm text-red-600 mt-2">{error}</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="font-bold text-kob-dark">{otherParticipantName}</h3>
        <p className="text-xs text-gray-500 mt-1">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Start the conversation!</p>
            <p className="text-sm text-gray-500 mt-2">Say hello to {otherParticipantName}</p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromCurrentUser = message.senderId === user?.uid
            return (
              <div
                key={message.id}
                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isFromCurrentUser
                      ? 'bg-kob-primary text-white rounded-br-none'
                      : 'bg-gray-200 text-kob-dark rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${isFromCurrentUser ? 'text-kob-light' : 'text-gray-600'}`}>
                    {new Date(message.createdAt?.toDate?.() || message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Read Status */}
      <div className="px-6 py-2 text-xs text-gray-500 text-center border-t border-gray-200 flex-shrink-0">
        Messages are updated in real-time
      </div>
    </div>
  )
}
