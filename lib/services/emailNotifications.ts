/**
 * Email Notification Service
 * Handles all email notifications for the platform
 * Note: This is the frontend interface. Actual email sending would be done via API
 */

export interface EmailRecipient {
  name: string;
  email: string;
}

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export type EmailType =
  | 'payment_confirmation'
  | 'booking_confirmation'
  | 'refund_issued'
  | 'refund_processed'
  | 'payout_scheduled'
  | 'payout_completed'
  | 'booking_cancelled'
  | 'payment_failed'
  | 'invoice_generated'
  | 'receipt_generated'
  | 'dispute_opened'
  | 'verification_required'
  | 'welcome'
  | 'password_reset';

/**
 * Generate email for payment confirmation
 */
export function generatePaymentConfirmationEmail(
  recipient: EmailRecipient,
  transactionDetails: {
    amount: number;
    currency: string;
    transactionId: string;
    bookingId?: string;
    propertyTitle?: string;
    checkInDate?: string;
    checkOutDate?: string;
  }
): EmailTemplate {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: transactionDetails.currency,
  }).format(transactionDetails.amount / 100);

  const subject = `Payment Confirmed - ${formattedAmount}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #006699, #0088cc); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .success-icon { font-size: 48px; margin-bottom: 10px; }
    .amount { font-size: 32px; font-weight: bold; margin: 20px 0; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .button { display: inline-block; background: #006699; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Payment Successful!</h1>
      <p>Your payment has been processed successfully</p>
    </div>
    <div class="content">
      <p>Hi ${recipient.name},</p>
      <p>Great news! We've received your payment.</p>
      
      <div class="amount">${formattedAmount}</div>
      
      <div class="details">
        <div class="detail-row">
          <span>Transaction ID:</span>
          <strong>${transactionDetails.transactionId}</strong>
        </div>
        ${transactionDetails.bookingId ? `
        <div class="detail-row">
          <span>Booking ID:</span>
          <strong>${transactionDetails.bookingId}</strong>
        </div>
        ` : ''}
        ${transactionDetails.propertyTitle ? `
        <div class="detail-row">
          <span>Property:</span>
          <strong>${transactionDetails.propertyTitle}</strong>
        </div>
        ` : ''}
        ${transactionDetails.checkInDate ? `
        <div class="detail-row">
          <span>Check-in:</span>
          <strong>${new Date(transactionDetails.checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </div>
        ` : ''}
        ${transactionDetails.checkOutDate ? `
        <div class="detail-row">
          <span>Check-out:</span>
          <strong>${new Date(transactionDetails.checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </div>
        ` : ''}
        <div class="detail-row">
          <span>Payment Date:</span>
          <strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </div>
      </div>
      
      <p>A receipt has been sent to your email and is available in your account.</p>
      
      <center>
        <a href="https://dalilebnb.com/transactions/${transactionDetails.transactionId}" class="button">View Transaction Details</a>
      </center>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      
      <p>Best regards,<br>The Dalile BnB Team</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply to this message.</p>
      <p>© ${new Date().getFullYear()} Dalile BnB Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textBody = `
Payment Successful!

Hi ${recipient.name},

Great news! We've received your payment of ${formattedAmount}.

Transaction Details:
- Transaction ID: ${transactionDetails.transactionId}
${transactionDetails.bookingId ? `- Booking ID: ${transactionDetails.bookingId}` : ''}
${transactionDetails.propertyTitle ? `- Property: ${transactionDetails.propertyTitle}` : ''}
- Payment Date: ${new Date().toLocaleDateString()}

A receipt has been sent to your email and is available in your account.

View transaction: https://dalilebnb.com/transactions/${transactionDetails.transactionId}

Best regards,
The Dalile BnB Team
  `.trim();

  return { subject, htmlBody, textBody };
}

/**
 * Generate email for refund confirmation
 */
export function generateRefundConfirmationEmail(
  recipient: EmailRecipient,
  refundDetails: {
    amount: number;
    currency: string;
    refundId: string;
    originalTransactionId: string;
    reason: string;
    processingTime: string;
  }
): EmailTemplate {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: refundDetails.currency,
  }).format(refundDetails.amount / 100);

  const subject = `Refund Approved - ${formattedAmount}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-icon { font-size: 48px; margin-bottom: 10px; }
    .amount { font-size: 32px; font-weight: bold; margin: 20px 0; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .alert-box { background: #fffbea; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="info-icon">💰</div>
      <h1>Refund Approved</h1>
      <p>Your refund request has been approved</p>
    </div>
    <div class="content">
      <p>Hi ${recipient.name},</p>
      <p>Your refund request has been approved and is being processed.</p>
      
      <div class="amount">${formattedAmount}</div>
      
      <div class="details">
        <div class="detail-row">
          <span>Refund ID:</span>
          <strong>${refundDetails.refundId}</strong>
        </div>
        <div class="detail-row">
          <span>Original Transaction:</span>
          <strong>${refundDetails.originalTransactionId}</strong>
        </div>
        <div class="detail-row">
          <span>Reason:</span>
          <strong>${refundDetails.reason}</strong>
        </div>
        <div class="detail-row">
          <span>Processing Time:</span>
          <strong>${refundDetails.processingTime}</strong>
        </div>
      </div>
      
      <div class="alert-box">
        <strong>⏱️ Please Note:</strong> Refunds typically take ${refundDetails.processingTime} to appear in your account, depending on your bank or card issuer.
      </div>
      
      <p>The refund will be credited to your original payment method.</p>
      
      <center>
        <a href="https://dalilebnb.com/refunds/${refundDetails.refundId}" class="button">Track Refund Status</a>
      </center>
      
      <p>If you have any questions about your refund, please contact our support team.</p>
      
      <p>Best regards,<br>The Dalile BnB Team</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply to this message.</p>
      <p>© ${new Date().getFullYear()} Dalile BnB Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textBody = `
Refund Approved

Hi ${recipient.name},

Your refund request has been approved and is being processed.

Refund Amount: ${formattedAmount}

Details:
- Refund ID: ${refundDetails.refundId}
- Original Transaction: ${refundDetails.originalTransactionId}
- Reason: ${refundDetails.reason}
- Processing Time: ${refundDetails.processingTime}

The refund will be credited to your original payment method within ${refundDetails.processingTime}.

Track refund: https://dalilebnb.com/refunds/${refundDetails.refundId}

Best regards,
The Dalile BnB Team
  `.trim();

  return { subject, htmlBody, textBody };
}

/**
 * Generate email for host payout
 */
export function generatePayoutNotificationEmail(
  recipient: EmailRecipient,
  payoutDetails: {
    amount: number;
    currency: string;
    payoutId: string;
    bookingCount: number;
    payoutDate: string;
    bankAccountLast4: string;
  }
): EmailTemplate {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: payoutDetails.currency,
  }).format(payoutDetails.amount / 100);

  const subject = `Payout Scheduled - ${formattedAmount}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .money-icon { font-size: 48px; margin-bottom: 10px; }
    .amount { font-size: 36px; font-weight: bold; margin: 20px 0; color: #10b981; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="money-icon">💸</div>
      <h1>Payout Scheduled!</h1>
      <p>Your earnings are on the way</p>
    </div>
    <div class="content">
      <p>Hi ${recipient.name},</p>
      <p>Great news! Your payout has been scheduled and will be transferred to your bank account shortly.</p>
      
      <div class="amount">${formattedAmount}</div>
      
      <div class="details">
        <div class="detail-row">
          <span>Payout ID:</span>
          <strong>${payoutDetails.payoutId}</strong>
        </div>
        <div class="detail-row">
          <span>Bookings Included:</span>
          <strong>${payoutDetails.bookingCount} booking${payoutDetails.bookingCount > 1 ? 's' : ''}</strong>
        </div>
        <div class="detail-row">
          <span>Transfer To:</span>
          <strong>****${payoutDetails.bankAccountLast4}</strong>
        </div>
        <div class="detail-row">
          <span>Expected Arrival:</span>
          <strong>${payoutDetails.payoutDate}</strong>
        </div>
      </div>
      
      <div class="success-box">
        <strong>🎉 Congratulations on your earnings!</strong> Your payout will typically arrive within 1-2 business days.
      </div>
      
      <center>
        <a href="https://dalilebnb.com/host/payouts" class="button">View Payout Details</a>
      </center>
      
      <p>Keep up the great hosting!</p>
      
      <p>Best regards,<br>The Dalile BnB Team</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply to this message.</p>
      <p>© ${new Date().getFullYear()} Dalile BnB Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textBody = `
Payout Scheduled!

Hi ${recipient.name},

Great news! Your payout has been scheduled.

Amount: ${formattedAmount}

Details:
- Payout ID: ${payoutDetails.payoutId}
- Bookings: ${payoutDetails.bookingCount}
- Transfer to: ****${payoutDetails.bankAccountLast4}
- Expected arrival: ${payoutDetails.payoutDate}

View payout details: https://dalilebnb.com/host/payouts

Keep up the great hosting!

Best regards,
The Dalile BnB Team
  `.trim();

  return { subject, htmlBody, textBody };
}

/**
 * Generate email for payment failure
 */
export function generatePaymentFailedEmail(
  recipient: EmailRecipient,
  failureDetails: {
    amount: number;
    currency: string;
    transactionId: string;
    reason: string;
    bookingId?: string;
  }
): EmailTemplate {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: failureDetails.currency,
  }).format(failureDetails.amount / 100);

  const subject = `Payment Failed - Action Required`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .error-icon { font-size: 48px; margin-bottom: 10px; }
    .amount { font-size: 28px; font-weight: bold; margin: 20px 0; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .error-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="error-icon">❌</div>
      <h1>Payment Failed</h1>
      <p>We couldn't process your payment</p>
    </div>
    <div class="content">
      <p>Hi ${recipient.name},</p>
      <p>Unfortunately, we were unable to process your payment of ${formattedAmount}.</p>
      
      <div class="error-box">
        <strong>Reason:</strong> ${failureDetails.reason}
      </div>
      
      <div class="details">
        <div class="detail-row">
          <span>Transaction ID:</span>
          <strong>${failureDetails.transactionId}</strong>
        </div>
        ${failureDetails.bookingId ? `
        <div class="detail-row">
          <span>Booking ID:</span>
          <strong>${failureDetails.bookingId}</strong>
        </div>
        ` : ''}
        <div class="detail-row">
          <span>Amount:</span>
          <strong>${formattedAmount}</strong>
        </div>
      </div>
      
      <p><strong>What you can do:</strong></p>
      <ul>
        <li>Check that your card details are correct</li>
        <li>Ensure you have sufficient funds</li>
        <li>Try using a different payment method</li>
        <li>Contact your bank if the issue persists</li>
      </ul>
      
      <center>
        <a href="https://dalilebnb.com/retry-payment/${failureDetails.transactionId}" class="button">Retry Payment</a>
      </center>
      
      <p>If you continue to experience issues, please contact our support team for assistance.</p>
      
      <p>Best regards,<br>The Dalile BnB Team</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply to this message.</p>
      <p>© ${new Date().getFullYear()} Dalile BnB Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textBody = `
Payment Failed - Action Required

Hi ${recipient.name},

Unfortunately, we were unable to process your payment of ${formattedAmount}.

Reason: ${failureDetails.reason}

Transaction ID: ${failureDetails.transactionId}
${failureDetails.bookingId ? `Booking ID: ${failureDetails.bookingId}` : ''}

What you can do:
- Check that your card details are correct
- Ensure you have sufficient funds
- Try using a different payment method
- Contact your bank if the issue persists

Retry payment: https://dalilebnb.com/retry-payment/${failureDetails.transactionId}

Best regards,
The Dalile BnB Team
  `.trim();

  return { subject, htmlBody, textBody };
}

/**
 * Send email via API (mock implementation)
 */
export async function sendEmail(
  recipient: EmailRecipient,
  template: EmailTemplate,
  emailType: EmailType
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In a real implementation, this would call your email API
    // For now, we'll simulate the API call
    console.log('Sending email:', {
      to: recipient.email,
      subject: template.subject,
      type: emailType,
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate success
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Queue email for sending (batch processing)
 */
export interface EmailQueue {
  id: string;
  recipient: EmailRecipient;
  template: EmailTemplate;
  emailType: EmailType;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  createdAt: Date;
  sentAt?: Date;
}

const emailQueue: EmailQueue[] = [];

export function queueEmail(
  recipient: EmailRecipient,
  template: EmailTemplate,
  emailType: EmailType
): string {
  const queueItem: EmailQueue = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipient,
    template,
    emailType,
    status: 'pending',
    attempts: 0,
    createdAt: new Date(),
  };
  
  emailQueue.push(queueItem);
  return queueItem.id;
}

export function getEmailQueue(): EmailQueue[] {
  return [...emailQueue];
}

