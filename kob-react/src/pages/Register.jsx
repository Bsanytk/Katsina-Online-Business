import React, { useState } from 'react'
import { registerUser } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await registerUser(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Register</h1>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div>
            <button className="px-4 py-2 bg-kob-primary text-white rounded" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
        </form>
      </div>
    </main>
  )
}
