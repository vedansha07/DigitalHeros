import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function PaymentConfirmed({ name, amount }: any) {
  return (
    <EmailLayout>
      <Text style={heading}>Capital Transferred</Text>
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        The Stripe integration layer has successfully transferred your allocated yield tranche of £{amount} directly into your configured monetary endpoints.
      </Text>
      <Text style={paragraph}>
        Transactions may take up to 48 hours to clear local banking ledgers, but platform clearance is confirmed.
      </Text>
      <Button style={button} href="https://digitalheros.app/dashboard">Enter Dashboard</Button>
    </EmailLayout>
  );
}
