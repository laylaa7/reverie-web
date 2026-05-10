'use client'

import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

interface ChartsProps {
  sessionsByDay: any[]
  doctorsBySpec: any[]
}

const COLORS = ['#6B8AFF', '#2B4FD4', '#A060E0', '#40C070', '#E8A030']

export function AdminCharts({ sessionsByDay, doctorsBySpec }: ChartsProps) {
  // Sessions per day — last 7 days
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const sessionData = days.map((day, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const count = sessionsByDay?.filter(s => {
      const d = new Date(s.session_datetime)
      return d.toDateString() === date.toDateString()
    }).length ?? 0
    return { day, count }
  })

  // Doctors by specialization
  const specCount: Record<string, number> = {}
  doctorsBySpec?.forEach(d => {
    const s = d.specialization ?? 'Other'
    specCount[s] = (specCount[s] ?? 0) + 1
  })
  const specData = Object.entries(specCount).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>

      {/* Sessions line chart */}
      <div style={{
        background: 'var(--card)',
        border: '0.5px solid var(--border)',
        borderRadius: '8px',
        padding: '24px',
      }}>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '8px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--text3)',
          margin: '0 0 20px',
        }}>
          Sessions — Last 7 Days
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={sessionData}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: '#0d1220',
                border: '0.5px solid rgba(107,138,255,0.3)',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                color: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6B8AFF"
              strokeWidth={1.5}
              dot={{ fill: '#6B8AFF', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Specializations pie */}
      <div style={{
        background: 'var(--card)',
        border: '0.5px solid var(--border)',
        borderRadius: '8px',
        padding: '24px',
      }}>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '8px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--text3)',
          margin: '0 0 20px',
        }}>
          Doctors by Specialization
        </p>
        {specData.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: '12px', textAlign: 'center', paddingTop: '40px', margin: 0 }}>
            No doctors yet
          </p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie
                  data={specData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {specData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {specData.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: COLORS[i % COLORS.length],
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif' }}>
                    {s.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginLeft: 'auto' }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
