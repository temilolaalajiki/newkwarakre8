import * as React from 'react'
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { EVENT } from '@/lib/event'

interface Props {
  full_name?: string
  class_batch?: string
  creative_interest?: string
  registration_id?: string
}

function RegistrationConfirmation({
  full_name = 'Creative',
  class_batch = '—',
  creative_interest = '—',
  registration_id = '—',
}: Props) {
  const firstName = full_name.split(' ')[0] || 'Creative'
  return (
    <Html>
      <Head />
      <Preview>You're in — Kwara Kre8ives 2.0 registration confirmed</Preview>
      <Body
        style={{
          backgroundColor: '#ffffff',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: 0,
          color: '#0f0f0f',
        }}
      >
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
          <Section
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5D67A 100%)',
              borderRadius: '16px',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            <Text style={{ margin: 0, color: '#1a1a1a', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Kwara Kre8ives 2.0
            </Text>
            <Heading style={{ margin: '8px 0 0', color: '#1a1a1a', fontSize: '24px' }}>
              You're in, {firstName}!
            </Heading>
          </Section>

          <Section style={{ padding: '24px 4px' }}>
            <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
              Your registration for <strong>{EVENT.name}</strong> is confirmed. Kindly keep this email safe, as it will be required for access to the event.
            </Text>

            <Section
              style={{
                border: '1px solid #eaeaea',
                borderRadius: '12px',
                padding: '16px 20px',
                marginTop: '16px',
              }}
            >
              <Row label="Registration ID" value={registration_id.slice(0, 8).toUpperCase()} />
              <Row label="Assigned Class" value={class_batch} />
              <Row label="Track" value={creative_interest} />
              <Row label="Date" value={EVENT.dateLabel} />
              <Row label="Arrival" value={EVENT.arrivalTime} />
              <Row label="Venue" value={EVENT.venue.name} />
              <Row label="Address" value={EVENT.venue.address} />
            </Section>

            <Hr style={{ borderColor: '#eaeaea', margin: '24px 0' }} />

            <Text style={{ fontSize: '14px', color: '#525252', lineHeight: '22px' }}>
              Need help? Reach us on {EVENT.contact.phone} or @{EVENT.contact.instagram} on Instagram.
            </Text>
            <Text style={{ fontSize: '12px', color: '#8a8a8a', marginTop: '24px' }}>
              © {new Date().getFullYear()} Kwara Kre8ives. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style={{ padding: '6px 0', fontSize: '12px', color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '1px', width: '45%' }}>
            {label}
          </td>
          <td style={{ padding: '6px 0', fontSize: '14px', color: '#0f0f0f', textAlign: 'right' }}>
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export const template = {
  component: RegistrationConfirmation,
  subject: (data: Record<string, any>) =>
    `You're in — ${EVENT.name} registration confirmed`,
  displayName: 'Registration Confirmation',
  previewData: {
    full_name: 'Temilola Alaji',
    class_batch: 'Photography Class A',
    creative_interest: 'Photography',
    registration_id: 'abc12345',
  },
} satisfies TemplateEntry
