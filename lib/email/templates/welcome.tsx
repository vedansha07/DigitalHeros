import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <EmailLayout>
      <Text style={heading}>Subscription Initialized.</Text>
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Your node has successfully synced to the Digital Heros network. Your fractional capital allocation has been routed, and your authorization matrix is live.
      </Text>
      <Text style={paragraph}>
        Next Phase: Execute your first 5-score injection sequence before the upcoming chronological trigger.
      </Text>
      <Button style={button} href="https://digitalheros.app/dashboard">Enter Dashboard Console</Button>
    </EmailLayout>
  );
}

export const heading = {
  fontSize: '24px',
  fontWeight: 900 as const,
  color: '#FFFFFF',
  marginBottom: '20px',
  letterSpacing: '-0.5px'
};

export const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#94a3b8',
  marginBottom: '20px',
  fontWeight: 500 as const
};

export const button = {
  backgroundColor: '#00C96B',
  borderRadius: '8px',
  color: '#0B1F3A',
  fontSize: '14px',
  fontWeight: 900 as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '16px',
  marginTop: '30px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px'
};
