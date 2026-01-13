import React from 'react'

export default function Contact() {
  return (
    <main className="container py-6">
      <h1 className="text-2xl font-semibold mb-3">Contact</h1>
      <p className="mb-3">Send us a message at <strong>support@kob.example</strong>.</p>
      <div className="space-y-3">
        <a className="inline-block px-4 py-2 bg-green-500 text-white rounded" href="https://wa.me/your-number" target="_blank">WhatsApp</a>
        <a className="inline-block px-4 py-2 bg-blue-600 text-white rounded" href="https://forms.gle/" target="_blank">Contact Form</a>
      </div>
    </main>
  )
}
