import * as React from 'react';
import { Text, Button } from '@react-email/components';
import EmailLayout from './EmailLayout';
import { heading, paragraph, button } from './welcome';

export default function DrawResults({ month, drawnNumbers }: any) {
  return (
    <EmailLayout>
      <Text style={heading}>Chronological Execution: {month}</Text>
      <Text style={paragraph}>
        The Monthly Algorithmic Parse for {month} has successfully executed and locked onto the blockchain ledger.
      </Text>
      <Text style={paragraph}>
        Physical output parameters exactly matched the following vector:
      </Text>
      <Text style={{...paragraph, fontWeight: 900, color: '#00C96B', fontSize: '20px', backgroundColor: '#0B1F3A', padding: '15px', borderRadius: '8px', textAlign: 'center'}}>
        {drawnNumbers.join(' - ')}
      </Text>
      <Text style={paragraph}>
        Any logic node returning 3, 4, or 5 identical vectors has inherited fractional distributions. Check your local dashboard for status parameters.
      </Text>
      <Button style={button} href="https://digitalheros.app/dashboard">Audit Local Matrices</Button>
    </EmailLayout>
  );
}
