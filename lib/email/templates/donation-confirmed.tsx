import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function DonationConfirmed({ name, amount, charityName }: any) {
  return (
    <EmailLayout>
      <Text style={heading}>Independent Philanthropy Validated</Text>
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        You successfully bypassed the subscription logistics and initiated an independent capital transfer to {charityName}.
      </Text>
      <Text style={{...paragraph, fontWeight: 900, fontSize: '24px', color: '#00C96B'}}>
        Transferred: £{amount}
      </Text>
      <Text style={paragraph}>
        This ledger acts as your formal receipt of transactional execution. Thank you for your structural engagement with Digital Heros.
      </Text>
      <Button style={button} href="https://digitalheros.app/">Return to Root</Button>
    </EmailLayout>
  );
}
