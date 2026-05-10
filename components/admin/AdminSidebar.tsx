import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebarClient from './AdminSidebarClient'

interface AdminSidebarProps {
  currentPath: string
  theme?: string
}

async function signOut() {
  'use server'
  const cookieStore = cookies()
  cookieStore.delete('reverie-admin-session')
  redirect('/admin/login')
}

export default function AdminSidebar({ currentPath }: AdminSidebarProps) {
  return <AdminSidebarClient currentPath={currentPath} onSignOut={signOut} />
}
