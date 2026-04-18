import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function SubscriptionLapsed({ name }: any) {
  return (
    <EmailLayout>
      <Text style={{...heading, color: '#f43f5e'}}>Authorization Revoked</Text>
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        We failed to process the latest chronological lifecycle charge. Consequently, your node access to the logic distribution matrix has lapsed.
      </Text>
      <Text style={paragraph}>
        Your data scores remain logged, but cannot execute against any Live Distributions until your financial link is re-established.
      </Text>
      <Button style={{...button, backgroundColor: '#f43f5e', color: '#fff'}} href="https://digitalheros.app/subscribe">Re-establish Node</Button>
    </EmailLayout>
  );
}
