'use client'

import { useState } from 'react'

type NotificationRecord = {
  id: string
  title: string
  body: string
  target_role: string
  created_at: string
}

export function SendNotificationForm({ history }: { history: NotificationRecord[] }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [targetRole, setTargetRole] = useState('all')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | null>(null)

  async function handleSend() {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, target_role: targetRole }),
      })
      if (res.ok) {
        setResult('success')
        setTitle('')
        setBody('')
        setTimeout(() => { setResult(null); window.location.reload() }, 2000)
      } else {
        setResult('error')
      }
    } catch {
      setResult('error')
    } finally {
      setSending(false)
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px',
    letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--card)', border: '0.5px solid var(--border)',
    borderRadius: '6px', padding: '10px 14px', color: 'var(--text)', fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div>
      {/* Compose form */}
      <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '28px', marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '0 0 24px' }}>
          Send Notification
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Notification title..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Target audience</label>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="all">All users</option>
              <option value="consumer">Consumers only</option>
              <option value="doctor">Doctors only</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            placeholder="Write your notification message..."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleSend}
            disabled={sending || !title.trim() || !body.trim()}
            style={{
              padding: '11px 28px', borderRadius: '6px',
              background: result === 'success' ? 'rgba(80,200,120,0.15)' : '#2B4FD4',
              border: result === 'success' ? '0.5px solid rgba(80,200,120,0.4)' : 'none',
              color: result === 'success' ? 'rgba(80,200,120,0.9)' : '#fff',
              fontSize: '13px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
              cursor: (sending || !title.trim() || !body.trim()) ? 'not-allowed' : 'pointer',
              opacity: (!title.trim() || !body.trim()) ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {result === 'success' ? '✓ Sent' : sending ? 'Sending...' : 'Send notification →'}
          </button>
          {result === 'error' && (
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,100,100,0.8)' }}>
              Failed to send. Try again.
            </span>
          )}
        </div>
      </div>

      {/* History */}
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>
        History
      </h2>

      {history.length === 0 ? (
        <p style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No notifications sent yet.</p>
      ) : (
        history.map(n => (
          <div key={n.id} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '16px 20px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                {n.title}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', padding: '2px 10px', borderRadius: '100px', background: 'rgba(107,138,255,0.08)', border: '0.5px solid rgba(107,138,255,0.15)', color: 'rgba(107,138,255,0.7)', fontFamily: 'DM Mono, monospace' }}>
                  {n.target_role}
                </span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'var(--text3)' }}>
                  {new Date(n.created_at).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text3)', margin: 0, lineHeight: 1.6 }}>
              {n.body}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
