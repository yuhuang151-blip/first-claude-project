import { useState } from 'react'

const EMAIL = 'yuhuang@example.com'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || 'Contact from website')
    const body = encodeURIComponent(
      `Hi Yu Huang,\n\n${form.message}\n\n— ${form.name} (${form.email})`
    )
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section className="contact">
      <h2 className="contact-title">Get in Touch</h2>
      <p className="contact-desc">
        Have a question or want to work together? Fill out the form below and it will open your email client to send me a message.
      </p>

      {sent ? (
        <div className="contact-success">
          <p>Your email client should have opened with the message. If not, you can email me directly at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
          <button className="contact-btn" onClick={() => setSent(false)}>Send another message</button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              id="name"
              className="form-input"
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Your name"
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="subject">Subject</label>
            <input
              id="subject"
              className="form-input"
              type="text"
              value={form.subject}
              onChange={update('subject')}
              placeholder="What is this about?"
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea
              id="message"
              className="form-input form-textarea"
              required
              value={form.message}
              onChange={update('message')}
              placeholder="Your message..."
              rows={6}
            />
          </div>
          <button type="submit" className="contact-btn">Send Message</button>
        </form>
      )}
    </section>
  )
}
