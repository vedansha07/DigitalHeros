import { Resend } from 'resend';
import WelcomeEmail from './templates/welcome';
import RenewalReminder from './templates/renewal-reminder';
import SubscriptionLapsed from './templates/subscription-lapsed';
import DrawResults from './templates/draw-results';
import WinnerNotification from './templates/winner-notification';
import VerificationApproved from './templates/verification-approved';
import VerificationRejected from './templates/verification-rejected';
import PaymentConfirmed from './templates/payment-confirmed';
import DonationConfirmed from './templates/donation-confirmed';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_123');

export async function sendEmail(templateId: string, to: string, data: any) {
  let subject = "Digital Heros Update";
  let reactComponent = null;

  switch (templateId) {
    case 'welcome': 
      subject = "Subscription Activated | Welcome to Digital Heros";
      reactComponent = WelcomeEmail(data);
      break;
    case 'renewal-reminder':
      subject = "Upcoming Sequence Renewal";
      reactComponent = RenewalReminder(data);
      break;
    case 'subscription-lapsed':
      subject = "Authorization Revoked | Action Required";
      reactComponent = SubscriptionLapsed(data);
      break;
    case 'draw-results':
      subject = `Chronological Execution: ${data.month}`;
      reactComponent = DrawResults(data);
      break;
    case 'winner-notification':
      subject = "Output Verification Triggered | Yield Secured";
      reactComponent = WinnerNotification(data);
      break;
    case 'verification-approved':
      subject = "Payload Verified | Stripe Transit Initiated";
      reactComponent = VerificationApproved(data);
      break;
    case 'verification-rejected':
      subject = "Payload Execution Error | Re-Submit Required";
      reactComponent = VerificationRejected(data);
      break;
    case 'payment-confirmed':
      subject = "Capital Transferred";
      reactComponent = PaymentConfirmed(data);
      break;
    case 'donation-confirmed':
      subject = "Independent Philanthropy Validated";
      reactComponent = DonationConfirmed(data);
      break;
    default:
      throw new Error(`Template ${templateId} not found`);
  }

  try {
     const { data: responseData, error } = await resend.emails.send({
        from: 'Digital Heros <system@digitalheros.app>',
        to,
        subject,
        react: reactComponent,
     });

     if (error) {
        console.error("Resend execution error: ", error);
        return { success: false, error };
     }
     return { success: true, data: responseData };
  } catch (err: any) {
     console.error("Critical Resend failure: ", err);
     return { success: false, error: err.message };
  }
}
