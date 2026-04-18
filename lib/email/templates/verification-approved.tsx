import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function VerificationApproved({ name, amount }: any) {
  return (
    <EmailLayout>
      <Text style={heading}>Payload Verified</Text>
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Your photographic payload has been audited and successfully confirmed against the internal logic matrix. 
      </Text>
      <Text style={paragraph}>
        Your yield tranche of £{amount} is now queuing for manual execution via our Stripe transit module. Depending on banking schedules, processing typically completes within 48-72 hours.
      </Text>
      <Button style={button} href="https://digitalheros.app/dashboard/winnings">Check Transit Status</Button>
    </EmailLayout>
  );
}
