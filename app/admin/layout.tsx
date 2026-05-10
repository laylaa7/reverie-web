import { cookies } from 'next/headers'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const theme = cookieStore.get('admin-theme')?.value ?? 'dark'

  return (
    <div data-theme={theme} style={{ colorScheme: theme === 'light' ? 'light' : 'dark' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        [data-theme="dark"] {
          --bg: #080B14;
          --bg2: #04070e;
          --card: #0d1220;
          --border: rgba(255,255,255,0.06);
          --text: #ffffff;
          --text2: rgba(255,255,255,0.4);
          --text3: rgba(255,255,255,0.2);
        }
        [data-theme="light"] {
          --bg: #F7F6F3;
          --bg2: #ffffff;
          --card: #ffffff;
          --border: rgba(0,0,0,0.08);
          --text: #080B14;
          --text2: rgba(0,0,0,0.5);
          --text3: rgba(0,0,0,0.3);
        }
        @media (max-width: 767px) {
          .admin-main { padding: 64px 20px 24px !important; }
          .admin-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-chart-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
      {children}
    </div>
  )
}
