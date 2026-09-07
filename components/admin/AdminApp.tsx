'use client'

import { useState } from 'react'
import { Badge, Button, Heading, Input, Label, StatusBadge, Table, Text, toast } from '@medusajs/ui'
import { moderateStamp, signInAdmin, signOutAdmin } from '@/lib/stamps/actions'
import { formatStampNumber } from '@/lib/stamp/slug'
import type { StampRecord, StampStatus } from '@/types/stamp'

export function AdminApp({
  email,
  stamps,
  configured,
}: {
  email: string | null
  stamps: StampRecord[]
  configured: boolean
}) {
  const [filter, setFilter] = useState<StampStatus | 'all'>('pending')

  if (!configured) {
    return (
      <div className="space-y-3 px-5 py-10 lg:px-8">
        <Heading>Inspection desk</Heading>
        <Text>Supabase is not configured. Submissions will be accepted locally until the ledger is connected.</Text>
      </div>
    )
  }

  if (!email) {
    return (
      <form action={async (formData) => {
        const result = await signInAdmin(formData)
        if (!result.ok) toast.error(result.error)
      }} className="mx-auto max-w-sm space-y-4 px-5 py-10">
        <Text size="xsmall" className="font-mono tracking-[0.16em] text-ui-fg-subtle">
          PRIVATE DESK
        </Text>
        <Heading>Kenzie Postal Service</Heading>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit">Enter</Button>
      </form>
    )
  }

  const visible = filter === 'all' ? stamps : stamps.filter((stamp) => stamp.status === filter)
  const pending = stamps.filter((stamp) => stamp.status === 'pending').length

  return (
    <div className="min-h-dvh bg-white">
      <header className="flex flex-col gap-2 border-b border-ui-border-base px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <Text size="xsmall" className="font-mono tracking-[0.14em] text-ui-fg-muted">
            KENZIE POST · ADMIN
          </Text>
          <Text size="xsmall" className="font-mono tracking-[0.14em] text-ui-fg-muted">
            MODERATION DESK
          </Text>
        </div>
        <Text size="small" className="font-mono text-ui-fg-muted">
          {stamps.filter((stamp) => stamp.status === 'approved').length} approved · {pending} pending
        </Text>
      </header>
      <div className="space-y-6 px-4 py-6 lg:px-12 lg:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Heading>Moderation</Heading>
          <Text size="small" className="text-ui-fg-muted">
            Review new mail before it enters the public archive. Signed in as {email}.
          </Text>
        </div>
        <form action={signOutAdmin}>
          <Button variant="transparent" size="small">
            Sign out
          </Button>
        </form>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Pending — {pending}</Badge>
        {(['all', 'pending', 'approved', 'rejected', 'hidden'] as const).map((value) => (
          <Button
            key={value}
            size="small"
            variant={filter === value ? 'secondary' : 'transparent'}
            onClick={() => setFilter(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="overflow-x-auto">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Stamp</Table.HeaderCell>
            <Table.HeaderCell>From</Table.HeaderCell>
            <Table.HeaderCell>Message</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {visible.map((stamp) => (
            <Table.Row key={stamp.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-12 overflow-hidden border border-ui-border-base bg-ui-bg-subtle">
                    {stamp.preview_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={stamp.preview_url} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <Text size="small" className="font-mono">
                    {formatStampNumber(stamp.number)}
                  </Text>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Text size="small">{stamp.creator_name}</Text>
                <Text size="xsmall" className="text-ui-fg-muted">
                  {stamp.creator_location || '—'}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text size="small" className="max-w-xs truncate">
                  {stamp.message}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <StatusBadge color={stamp.status === 'approved' ? 'green' : stamp.status === 'pending' ? 'orange' : 'red'}>
                  {stamp.status}
                </StatusBadge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-1">
                  {stamp.status === 'pending' ? (
                    <>
                      <Button
                        size="small"
                        onClick={async () => {
                          const result = await moderateStamp({ stampId: stamp.id, action: 'approve' })
                          if (!result.ok) toast.error(result.error)
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={async () => {
                          const result = await moderateStamp({ stampId: stamp.id, action: 'reject' })
                          if (!result.ok) toast.error(result.error)
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      variant="transparent"
                      onClick={async () => {
                        const result = await moderateStamp({ stampId: stamp.id, action: 'hide' })
                        if (!result.ok) toast.error(result.error)
                      }}
                    >
                      Hide
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      </div>
    </div>
    </div>
  )
}
