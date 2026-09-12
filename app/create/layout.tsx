import { SubmissionsClosed } from '@/components/create/SubmissionsClosed'
import { areSubmissionsOpen } from '@/lib/env'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  if (!areSubmissionsOpen()) return <SubmissionsClosed />
  return children
}
