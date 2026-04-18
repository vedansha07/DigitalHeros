import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function VerificationRejected({ name, reason }: any) {
  return (
    <EmailLayout>
      <Text style={{...heading, color: '#f43f5e'}}>Payload Execution Error</Text>
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Your recent photograph payload failed authorization logic during Admin screening. We are unable to disburse capital until specific parameters are rectified.
      </Text>
      <Text style={{...paragraph, fontWeight: 700, backgroundColor: '#f43f5e', color: '#fff', padding: '15px', borderRadius: '8px'}}>
        Rejection Flag: {reason}
      </Text>
      <Text style={paragraph}>
        Locate standard compliance protocols inside the verification portal and re-submit a localized payload.
      </Text>
      <Button style={{...button, backgroundColor: '#f43f5e', color: '#fff'}} href="https://digitalheros.app/dashboard/winnings">Re-Submit Payload</Button>
    </EmailLayout>
  );
}
