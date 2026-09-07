import { AdminApp } from '@/components/admin/AdminApp'
import { isSupabaseConfigured } from '@/lib/env'
import { getAdminSessionEmail } from '@/lib/stamps/actions'
import { getAdminStamps } from '@/lib/stamps/data'

export default async function AdminPage() {
  const configured = isSupabaseConfigured()
  const email = configured ? await getAdminSessionEmail() : null
  const stamps = email ? await getAdminStamps() : []
  return <AdminApp email={email} stamps={stamps} configured={configured} />
}
