import React, { useState } from 'react'
import { Button, Textarea } from '../ui'
import { sendMessage } from '../services/chat'
import { useAuth } from '../hooks/useAuth'

/**
 * ChatInput Component
 * Input form to send messages in a conversation
 */
export default function ChatInput({ conversationId, onMessageSent }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim() || !conversationId || !user?.uid) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await sendMessage(conversationId, user.uid, text.trim())
      setText('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      if (onMessageSent) {
        onMessageSent()
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          Message sent!
        </div>
      )}

      {/* Message Input */}
      <div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading || !conversationId}
          rows={3}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          {text.length}/500 characters
        </p>
      </div>

      {/* Send Button */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          onClick={() => setText('')}
          variant="outline"
          disabled={loading || !text.trim()}
          className="px-4"
        >
          Clear
        </Button>
        <Button
          type="submit"
          disabled={loading || !text.trim() || !conversationId}
          className="px-6"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  )
}
