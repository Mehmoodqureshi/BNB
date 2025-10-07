/**
 * Fraud Detection Service
 * Client-side fraud prevention and validation utilities
 */

export interface FraudCheckResult {
  passed: boolean;
  riskScore: number; // 0-100 (0 = no risk, 100 = highest risk)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: FraudFlag[];
  recommendations: string[];
}

export interface FraudFlag {
  type: FraudFlagType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
}

export type FraudFlagType =
  | 'velocity_check_failed'
  | 'suspicious_email'
  | 'payment_amount_unusual'
  | 'new_account'
  | 'multiple_payment_attempts'
  | 'mismatched_information'
  | 'high_value_transaction'
  | 'disposable_email'
  | 'vpn_detected'
  | 'suspicious_timing';

/**
 * Check for payment velocity (too many transactions in short time)
 */
export function checkPaymentVelocity(
  recentTransactions: { timestamp: Date; amount: number }[],
  timeWindowMinutes: number = 60,
  maxTransactions: number = 3
): FraudFlag | null {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - timeWindowMinutes * 60 * 1000);
  
  const recentCount = recentTransactions.filter(
    t => new Date(t.timestamp) >= cutoffTime
  ).length;
  
  if (recentCount >= maxTransactions) {
    return {
      type: 'velocity_check_failed',
      severity: 'high',
      message: `${recentCount} payment attempts in ${timeWindowMinutes} minutes`,
      details: { count: recentCount, timeWindow: timeWindowMinutes },
    };
  }
  
  return null;
}

/**
 * Check for suspicious email patterns
 */
export function checkEmailPattern(email: string): FraudFlag | null {
  const disposableEmailDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email', 'temp-mail.org',
    'fakeinbox.com', 'trashmail.com'
  ];
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  
  if (!emailDomain) {
    return {
      type: 'suspicious_email',
      severity: 'high',
      message: 'Invalid email format',
    };
  }
  
  if (disposableEmailDomains.includes(emailDomain)) {
    return {
      type: 'disposable_email',
      severity: 'medium',
      message: 'Disposable email address detected',
      details: { domain: emailDomain },
    };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /^[a-z0-9]{20,}@/i, // Very long random string before @
    /^test.*@/i, // Starts with 'test'
    /^temp.*@/i, // Starts with 'temp'
    /\+.*@/, // Contains plus sign (email aliasing, not necessarily fraud but worth flagging)
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      return {
        type: 'suspicious_email',
        severity: 'low',
        message: 'Email pattern matches suspicious criteria',
        details: { pattern: pattern.toString() },
      };
    }
  }
  
  return null;
}

/**
 * Check for unusual transaction amounts
 */
export function checkTransactionAmount(
  amount: number,
  userAverageTransaction: number | null,
  isFirstTransaction: boolean = false
): FraudFlag | null {
  // First transaction over AED 5,000
  if (isFirstTransaction && amount > 500000) {
    return {
      type: 'high_value_transaction',
      severity: 'medium',
      message: 'First transaction with high value',
      details: { amount, threshold: 500000 },
    };
  }
  
  // Transaction significantly higher than average
  if (userAverageTransaction && amount > userAverageTransaction * 3) {
    return {
      type: 'payment_amount_unusual',
      severity: 'medium',
      message: 'Transaction amount significantly above user average',
      details: { amount, average: userAverageTransaction },
    };
  }
  
  // Very high value transaction
  if (amount > 2000000) { // Over AED 20,000
    return {
      type: 'high_value_transaction',
      severity: 'high',
      message: 'Extremely high transaction value',
      details: { amount },
    };
  }
  
  return null;
}

/**
 * Check account age
 */
export function checkAccountAge(accountCreatedAt: Date): FraudFlag | null {
  const now = new Date();
  const accountAgeHours = (now.getTime() - accountCreatedAt.getTime()) / (1000 * 60 * 60);
  
  // Account created within last 24 hours
  if (accountAgeHours < 24) {
    return {
      type: 'new_account',
      severity: 'medium',
      message: 'Account created within last 24 hours',
      details: { accountAgeHours: Math.round(accountAgeHours) },
    };
  }
  
  return null;
}

/**
 * Check for multiple failed payment attempts
 */
export function checkFailedPaymentAttempts(
  failedAttempts: { timestamp: Date; reason: string }[],
  timeWindowMinutes: number = 30,
  maxFailures: number = 3
): FraudFlag | null {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - timeWindowMinutes * 60 * 1000);
  
  const recentFailures = failedAttempts.filter(
    attempt => new Date(attempt.timestamp) >= cutoffTime
  );
  
  if (recentFailures.length >= maxFailures) {
    return {
      type: 'multiple_payment_attempts',
      severity: 'high',
      message: `${recentFailures.length} failed payment attempts in ${timeWindowMinutes} minutes`,
      details: { count: recentFailures.length, reasons: recentFailures.map(f => f.reason) },
    };
  }
  
  return null;
}

/**
 * Check for suspicious booking timing
 */
export function checkBookingTiming(
  checkInDate: Date,
  bookingDate: Date = new Date()
): FraudFlag | null {
  const daysInAdvance = Math.floor(
    (checkInDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Same-day or next-day booking with high value could be suspicious
  if (daysInAdvance <= 1) {
    return {
      type: 'suspicious_timing',
      severity: 'low',
      message: 'Last-minute booking (same or next day)',
      details: { daysInAdvance },
    };
  }
  
  // Booking too far in advance (over 1 year)
  if (daysInAdvance > 365) {
    return {
      type: 'suspicious_timing',
      severity: 'low',
      message: 'Booking made very far in advance',
      details: { daysInAdvance },
    };
  }
  
  return null;
}

/**
 * Validate card number format (Luhn algorithm)
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Validate card expiration
 */
export function validateCardExpiration(month: number, year: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (month < 1 || month > 12) {
    return false;
  }
  
  if (year < currentYear) {
    return false;
  }
  
  if (year === currentYear && month < currentMonth) {
    return false;
  }
  
  // Expiration too far in future (more than 10 years)
  if (year > currentYear + 10) {
    return false;
  }
  
  return true;
}

/**
 * Check billing address mismatch
 */
export function checkBillingAddressMismatch(
  billingCountry: string,
  cardCountry: string | null
): FraudFlag | null {
  if (cardCountry && billingCountry.toLowerCase() !== cardCountry.toLowerCase()) {
    return {
      type: 'mismatched_information',
      severity: 'medium',
      message: 'Billing address country does not match card country',
      details: { billingCountry, cardCountry },
    };
  }
  
  return null;
}

/**
 * Comprehensive fraud check
 */
export interface FraudCheckInput {
  amount: number;
  email: string;
  accountCreatedAt: Date;
  recentTransactions: { timestamp: Date; amount: number }[];
  failedPaymentAttempts: { timestamp: Date; reason: string }[];
  userAverageTransaction: number | null;
  isFirstTransaction: boolean;
  checkInDate?: Date;
  billingCountry?: string;
  cardCountry?: string | null;
}

export function performFraudCheck(input: FraudCheckInput): FraudCheckResult {
  const flags: FraudFlag[] = [];
  
  // Run all checks
  const velocityFlag = checkPaymentVelocity(input.recentTransactions);
  if (velocityFlag) flags.push(velocityFlag);
  
  const emailFlag = checkEmailPattern(input.email);
  if (emailFlag) flags.push(emailFlag);
  
  const amountFlag = checkTransactionAmount(
    input.amount,
    input.userAverageTransaction,
    input.isFirstTransaction
  );
  if (amountFlag) flags.push(amountFlag);
  
  const accountAgeFlag = checkAccountAge(input.accountCreatedAt);
  if (accountAgeFlag) flags.push(accountAgeFlag);
  
  const failedAttemptsFlag = checkFailedPaymentAttempts(input.failedPaymentAttempts);
  if (failedAttemptsFlag) flags.push(failedAttemptsFlag);
  
  if (input.checkInDate) {
    const timingFlag = checkBookingTiming(input.checkInDate);
    if (timingFlag) flags.push(timingFlag);
  }
  
  if (input.billingCountry && input.cardCountry) {
    const addressFlag = checkBillingAddressMismatch(input.billingCountry, input.cardCountry);
    if (addressFlag) flags.push(addressFlag);
  }
  
  // Calculate risk score
  const severityScores = {
    low: 10,
    medium: 25,
    high: 40,
    critical: 60,
  };
  
  const riskScore = Math.min(
    100,
    flags.reduce((score, flag) => score + severityScores[flag.severity], 0)
  );
  
  // Determine risk level
  let riskLevel: FraudCheckResult['riskLevel'];
  if (riskScore >= 80) {
    riskLevel = 'critical';
  } else if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (riskLevel === 'critical') {
    recommendations.push('Block transaction and require manual review');
    recommendations.push('Contact user via phone for verification');
  } else if (riskLevel === 'high') {
    recommendations.push('Require additional verification (3D Secure)');
    recommendations.push('Request additional identification documents');
  } else if (riskLevel === 'medium') {
    recommendations.push('Enable enhanced monitoring for this transaction');
    recommendations.push('Send verification email to user');
  }
  
  if (flags.some(f => f.type === 'velocity_check_failed')) {
    recommendations.push('Implement rate limiting for this user');
  }
  
  if (flags.some(f => f.type === 'disposable_email')) {
    recommendations.push('Require email verification');
  }
  
  return {
    passed: riskLevel !== 'critical',
    riskScore,
    riskLevel,
    flags,
    recommendations,
  };
}

/**
 * Simple risk scoring for quick checks
 */
export function calculateQuickRiskScore(
  isNewAccount: boolean,
  isHighValue: boolean,
  hasFailedAttempts: boolean,
  isSuspiciousEmail: boolean
): number {
  let score = 0;
  
  if (isNewAccount) score += 15;
  if (isHighValue) score += 25;
  if (hasFailedAttempts) score += 40;
  if (isSuspiciousEmail) score += 20;
  
  return Math.min(100, score);
}

/**
 * Generate fraud report
 */
export function generateFraudReport(result: FraudCheckResult): string {
  let report = `Fraud Risk Assessment Report\n`;
  report += `${'='.repeat(50)}\n\n`;
  report += `Overall Risk Level: ${result.riskLevel.toUpperCase()}\n`;
  report += `Risk Score: ${result.riskScore}/100\n`;
  report += `Status: ${result.passed ? 'PASSED' : 'FAILED'}\n\n`;
  
  if (result.flags.length > 0) {
    report += `Detected Issues (${result.flags.length}):\n`;
    report += `${'-'.repeat(50)}\n`;
    result.flags.forEach((flag, index) => {
      report += `${index + 1}. [${flag.severity.toUpperCase()}] ${flag.message}\n`;
      if (flag.details) {
        report += `   Details: ${JSON.stringify(flag.details)}\n`;
      }
    });
    report += `\n`;
  }
  
  if (result.recommendations.length > 0) {
    report += `Recommendations:\n`;
    report += `${'-'.repeat(50)}\n`;
    result.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
  }
  
  return report;
}

