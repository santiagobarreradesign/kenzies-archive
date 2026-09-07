import Link from 'next/link'
import { Button, Heading, Text } from '@medusajs/ui'

export default function NotFound() {
  return (
    <div className="space-y-4">
      <Heading>This piece of mail could not be found.</Heading>
      <Text className="text-ui-fg-muted">It may still be pending inspection, or the number was never issued.</Text>
      <Button asChild>
        <Link href="/">Return to archive</Link>
      </Button>
    </div>
  )
}
