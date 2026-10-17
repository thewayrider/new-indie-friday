import React, { useState } from 'react'
import { Card, Stack, Flex, Button, Text, Badge, Dialog, Box } from '@sanity/ui'
import { EnvelopeIcon, RocketIcon } from '@sanity/icons'
import { useFormValue } from 'sanity'

export function BroadcastDispatcherInput() {
  const documentId = useFormValue(['_id'])
  const status = useFormValue(['status']) || 'draft'
  const sentAt = useFormValue(['sentAt'])
  const sentCount = useFormValue(['sentCount'])
  const lastTestSentAt = useFormValue(['lastTestSentAt'])

  const [isSendingTest, setIsSendingTest] = useState(false)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const isSent = status === 'sent'

  const handleSendTest = async () => {
    if (!documentId) return
    setIsSendingTest(true)
    setFeedback(null)
    try {
      const res = await fetch('https://www.streamusique.com/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          broadcastId: documentId,
          isTest: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to send test email')
      }
      setFeedback({
        type: 'success',
        message: `Preview test sent to ${data.sentTo || 'admin email'}! Check your inbox.`,
      })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Error sending test: ${err.message}`,
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleBroadcast = async () => {
    if (!documentId) return
    setConfirmDialogOpen(false)
    setIsBroadcasting(true)
    setFeedback(null)
    try {
      const res = await fetch('https://www.streamusique.com/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          broadcastId: documentId,
          isTest: false,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to broadcast')
      }
      setFeedback({
        type: 'success',
        message: `Broadcast complete! Successfully delivered to ${data.recipientCount} subscribers.`,
      })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Broadcast failed: ${err.message}`,
      })
    } finally {
      setIsBroadcasting(false)
    }
  }

  return (
    <Card
      padding={4}
      radius={3}
      tone={isSent ? 'positive' : 'caution'}
      border
      style={{
        backgroundColor: isSent ? '#f0fdf4' : '#fffbeb',
        borderColor: isSent ? '#86efac' : '#fde68a',
        marginTop: '8px',
        marginBottom: '16px',
      }}
    >
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text weight="bold" size={2}>
            ✉️ Email Broadcast Dispatcher
          </Text>
          <Badge tone={isSent ? 'positive' : 'caution'} size={2}>
            {isSent ? '✓ SENT TO SUBSCRIBERS' : 'DRAFT (NOT SENT)'}
          </Badge>
        </Flex>

        {isSent && sentAt ? (
          <Text size={1} muted>
            Delivered to {sentCount || 'all'} subscribers on {new Date(sentAt).toLocaleString()}.
          </Text>
        ) : lastTestSentAt ? (
          <Text size={1} muted>
            Last preview test sent at {new Date(lastTestSentAt).toLocaleTimeString()}.
          </Text>
        ) : (
          <Text size={1} muted>
            You can test how this email looks in your own inbox before broadcasting to subscribers.
          </Text>
        )}

        <Flex gap={3} wrap="wrap">
          <Button
            mode="ghost"
            tone="default"
            icon={EnvelopeIcon}
            text={isSendingTest ? 'Sending Test...' : 'Send Preview Test to Kim'}
            disabled={isSendingTest || isBroadcasting}
            onClick={handleSendTest}
          />

          <Button
            tone="positive"
            icon={RocketIcon}
            text={isBroadcasting ? 'Broadcasting...' : isSent ? 'Already Sent' : 'Broadcast to All Subscribers'}
            disabled={isSendingTest || isBroadcasting || isSent}
            onClick={() => setConfirmDialogOpen(true)}
          />
        </Flex>

        {feedback && (
          <Card
            padding={3}
            radius={2}
            tone={feedback.type === 'success' ? 'positive' : 'critical'}
            border
          >
            <Text size={1} weight="medium">
              {feedback.type === 'success' ? '✓ ' : '⚠ '}
              {feedback.message}
            </Text>
          </Card>
        )}

        {confirmDialogOpen && (
          <Dialog
            id="confirm-broadcast-dialog"
            header="Confirm Live Email Broadcast"
            onClose={() => setConfirmDialogOpen(false)}
            footer={
              <Flex justify="flex-end" gap={2} padding={3}>
                <Button mode="ghost" text="Cancel" onClick={() => setConfirmDialogOpen(false)} />
                <Button
                  tone="critical"
                  text="Yes, Send to All Subscribers"
                  onClick={handleBroadcast}
                />
              </Flex>
            }
          >
            <Box padding={4}>
              <Stack space={3}>
                <Text weight="bold" size={2}>
                  Are you ready to broadcast this campaign?
                </Text>
                <Text size={1} muted>
                  This will immediately send this email to all active New Indie Friday subscribers via Resend.
                </Text>
              </Stack>
            </Box>
          </Dialog>
        )}
      </Stack>
    </Card>
  )
}
