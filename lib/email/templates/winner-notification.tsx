import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function WinnerNotification({ name, amount, matchTier, month }: any) {
  return (
    <EmailLayout>
      <Text style={heading}>Output Verification Triggered</Text>
      <Text style={paragraph}>Congratulations {name},</Text>
      <Text style={paragraph}>
        The {month} execution logic has verified a {matchTier} parameter correlation inside your physical dataset. You have successfully bypassed the statistical pool and secured fractional capital.
      </Text>
      <Text style={{...paragraph, fontWeight: 900, fontSize: '24px', color: '#00C96B'}}>
        Yield Tranche: £{amount}
      </Text>
      <Text style={paragraph}>
        Proceed to the Verification portal to execute a manual photograph payload of your Stableford scorecard.
      </Text>
      <Button style={button} href="https://digitalheros.app/dashboard/winnings">Submit Verification Payload</Button>
    </EmailLayout>
  );
}
