import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function RenewalReminder({ name, date, amount }: any) {
  return (
    <EmailLayout>
      <Text style={heading}>Upcoming Sequence Renewal</Text>
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Your platform membership is scheduled for its automated cycle renewal on {date} for £{amount}.
      </Text>
      <Text style={paragraph}>
        No manual intervention is required. This ensures your active status remains valid across all subsequent internal logic iterations.
      </Text>
      <Button style={button} href="https://digitalheros.app/dashboard/subscription">Manage Authorization</Button>
    </EmailLayout>
  );
}
