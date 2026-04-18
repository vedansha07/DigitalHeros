import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Img } from '@react-email/components';

export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>DIGITAL<span style={{ color: '#00C96B' }}>HEROS</span></Text>
          </Section>
          <Section style={content}>
            {children}
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              Systematic Philanthropy & Capital Distribution.
              <br />
              Digital Heros Ltd. {new Date().getFullYear()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#091527',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#0B1F3A',
  margin: '40px auto',
  padding: '0px',
  borderRadius: '16px',
  border: '1px solid #1a2e4c',
  width: '580px',
  maxWidth: '100%',
  overflow: 'hidden'
};

const header = {
  padding: '30px 40px',
  borderBottom: '1px solid #1a2e4c',
};

const logo = {
  fontWeight: 900 as const,
  fontSize: '24px',
  letterSpacing: '-1px',
  margin: '0',
  color: '#FFFFFF'
};

const content = {
  padding: '40px',
};

const footer = {
  padding: '30px 40px',
  borderTop: '1px solid #1a2e4c',
  backgroundColor: '#081730',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#4b5563',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: 0
};
