'use client'

import { useState } from 'react'
import { cookies } from 'next/headers'

interface AdminSidebarProps {
  currentPath: string
  theme?: string
  onSignOut: () => Promise<void>
}

const navLinks = [
  { label: 'Overview',      href: '/admin' },
  { label: 'Applications',  href: '/admin/applications' },
  { label: 'Doctors',       href: '/admin/doctors' },
  { label: 'Users',         href: '/admin/consumers' },
  { label: 'Sessions',      href: '/admin/sessions' },
  { label: 'Notifications', href: '/admin/notifications' },
  { label: 'Admins',        href: '/admin/admins' },
  { label: 'Profile',       href: '/admin/profile' },
]

const icons: Record<string, React.ReactNode> = {
  '/admin': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  '/admin/applications': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  '/admin/doctors': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <line x1="12" y1="11" x2="12" y2="15"/><line x1="10" y1="13" x2="14" y2="13"/>
    </svg>
  ),
  '/admin/consumers': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  '/admin/sessions': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  '/admin/notifications': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  '/admin/admins': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  '/admin/profile': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
}

export default function AdminSidebar({ currentPath, onSignOut }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <>
      {/* Wordmark */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '-0.5px',
        }}>
          Re<span style={{ color: '#6B8AFF' }}>V</span>erie
        </span>
        <span style={{
          display: 'block',
          fontFamily: 'DM Mono, monospace',
          fontSize: '7px',
          letterSpacing: '2px',
          color: 'var(--text3)',
          textTransform: 'uppercase',
          marginTop: '2px',
        }}>
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav>
        {navLinks.map(({ label, href }) => {
          const isActive = currentPath === href
          return (
            <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 24px',
              fontSize: '13px',
              color: isActive ? 'var(--text)' : 'var(--text2)',
              textDecoration: 'none',
              borderLeft: isActive ? '2px solid #6B8AFF' : '2px solid transparent',
              background: isActive ? 'rgba(107,138,255,0.06)' : 'transparent',
              transition: 'all 0.2s',
              minHeight: '44px',
            }}>
              <span style={{ opacity: isActive ? 1 : 0.45, flexShrink: 0 }}>
                {icons[href]}
              </span>
              {label}
            </a>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{
        marginTop: 'auto',
        padding: '16px 24px',
        borderTop: '0.5px solid var(--border)',
      }}>
        <form action={onSignOut}>
          <button type="submit" style={{
            fontSize: '12px',
            color: 'var(--text3)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            padding: 0,
          }}>
            Sign out
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .admin-hamburger { display: none !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="admin-sidebar-desktop" style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--bg2)',
        borderRight: '0.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="admin-hamburger"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 200,
          background: 'var(--bg2)',
          border: '0.5px solid var(--border)',
          borderRadius: '8px',
          width: '40px',
          height: '40px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text)',
        }}
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar slide-in */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: mobileOpen ? 0 : '-240px',
        width: '220px',
        height: '100vh',
        zIndex: 400,
        background: 'var(--bg2)',
        borderRight: '0.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        transition: 'left 0.3s ease',
      }}
        className="admin-sidebar-mobile"
      >
        <button
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--text3)',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ✕
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}
