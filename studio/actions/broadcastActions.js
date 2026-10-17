import { useState } from 'react'
import { EnvelopeIcon, RocketIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'

export function SendTestBroadcastAction(props) {
  const { id, draft, published } = props
  const toast = useToast()
  const [isSending, setIsSending] = useState(false)

  const doc = draft || published
  const isSent = published?.status === 'sent'

  return {
    label: isSending ? 'Sending Preview...' : 'Send Test Preview',
    icon: EnvelopeIcon,
    disabled: isSending || !doc,
    title: 'Send a preview test email to adminTestEmail (kim@streamusique.com)',
    onHandle: async () => {
      setIsSending(true)
      try {
        const res = await fetch('https://www.streamusique.com/api/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            broadcastId: id,
            isTest: true,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || data.message || 'Failed to send test email')
        }
        toast.push({
          status: 'success',
          title: 'Test Email Sent!',
          description: `Preview delivered to ${data.sentTo || 'admin email'}. Check your inbox!`,
        })
      } catch (err) {
        toast.push({
          status: 'error',
          title: 'Failed to send test email',
          description: err.message,
        })
      } finally {
        setIsSending(false)
        if (props.onComplete) props.onComplete()
      }
    },
  }
}

export function SendLiveBroadcastAction(props) {
  const { id, draft, published } = props
  const toast = useToast()
  const [isSending, setIsSending] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isAlreadySent = published?.status === 'sent'
  const isPublished = Boolean(published)

  return {
    label: isSending ? 'Broadcasting...' : isAlreadySent ? 'Already Broadcast' : 'Broadcast to Subscribers',
    icon: RocketIcon,
    disabled: isSending || isAlreadySent || !isPublished,
    title: !isPublished
      ? 'Please publish this broadcast before sending to live subscribers.'
      : isAlreadySent
      ? 'This campaign has already been sent to subscribers.'
      : 'Send this campaign to all active subscribers via Resend.',
    dialog: dialogOpen && {
      type: 'confirm',
      onCancel: () => setDialogOpen(false),
      onConfirm: async () => {
        setDialogOpen(false)
        setIsSending(true)
        try {
          const res = await fetch('https://www.streamusique.com/api/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              broadcastId: id,
              isTest: false,
            }),
          })
          const data = await res.json()
          if (!res.ok) {
            throw new Error(data.error || data.message || 'Failed to broadcast')
          }
          toast.push({
            status: 'success',
            title: 'Broadcast Complete!',
            description: `Successfully delivered to ${data.recipientCount} subscribers.`,
          })
        } catch (err) {
          toast.push({
            status: 'error',
            title: 'Broadcast Failed',
            description: err.message,
          })
        } finally {
          setIsSending(false)
          if (props.onComplete) props.onComplete()
        }
      },
      message: 'Are you sure you want to broadcast this email to all active subscribers?',
    },
    onHandle: () => {
      setDialogOpen(true)
    },
  }
}
