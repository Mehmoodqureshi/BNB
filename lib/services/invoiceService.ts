/**
 * Invoice Generation Service
 * Generates invoices and receipts for transactions
 */

import { Transaction } from '@/lib/types/payments';
import { formatCurrency, calculateVAT, PriceBreakdown } from './paymentCalculations';

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  transaction: Transaction;
  booking?: {
    propertyTitle: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    guests: number;
  };
  guest: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  host: {
    name: string;
    businessName?: string;
    taxId?: string;
    email: string;
  };
  platform: {
    name: string;
    address: string;
    taxId: string;
    email: string;
    website: string;
  };
  breakdown: {
    baseAmount: number;
    cleaningFee: number;
    serviceFee: number;
    vatAmount: number;
    totalAmount: number;
  };
  notes?: string;
  termsAndConditions?: string;
}

export interface ReceiptData extends InvoiceData {
  receiptNumber: string;
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
  };
  paymentDate: Date;
  paymentStatus: 'paid' | 'refunded' | 'partially_refunded';
}

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(transactionId: string, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const shortId = transactionId.substring(0, 8).toUpperCase();
  return `INV-${year}${month}-${shortId}`;
}

/**
 * Generate receipt number
 */
export function generateReceiptNumber(transactionId: string, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const shortId = transactionId.substring(0, 8).toUpperCase();
  return `RCT-${year}${month}-${shortId}`;
}

/**
 * Prepare invoice data
 */
export function prepareInvoiceData(
  transaction: Transaction,
  guestInfo: InvoiceData['guest'],
  hostInfo: InvoiceData['host'],
  bookingInfo?: InvoiceData['booking']
): InvoiceData {
  const invoiceDate = new Date(transaction.created_at);
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days
  
  // Calculate breakdown
  const serviceFee = transaction.fees.service_fee;
  const vatAmount = calculateVAT(transaction.amount + serviceFee);
  const baseAmount = transaction.amount - (transaction.metadata?.cleaningFee || 0);
  
  return {
    invoiceNumber: generateInvoiceNumber(transaction.id, invoiceDate),
    invoiceDate,
    dueDate,
    transaction,
    booking: bookingInfo,
    guest: guestInfo,
    host: hostInfo,
    platform: {
      name: 'Dalile BnB Platform',
      address: 'Dubai, United Arab Emirates',
      taxId: 'TRN-100000000000003', // UAE Tax Registration Number
      email: 'billing@dalilebnb.com',
      website: 'https://dalilebnb.com',
    },
    breakdown: {
      baseAmount,
      cleaningFee: transaction.metadata?.cleaningFee || 0,
      serviceFee,
      vatAmount,
      totalAmount: transaction.amount + serviceFee + vatAmount,
    },
    notes: 'Thank you for your business.',
    termsAndConditions: 'Payment is due within 7 days. Late payments may incur additional fees.',
  };
}

/**
 * Prepare receipt data
 */
export function prepareReceiptData(
  transaction: Transaction,
  guestInfo: ReceiptData['guest'],
  hostInfo: ReceiptData['host'],
  paymentMethod: ReceiptData['paymentMethod'],
  bookingInfo?: ReceiptData['booking']
): ReceiptData {
  const invoiceData = prepareInvoiceData(transaction, guestInfo, hostInfo, bookingInfo);
  const paymentDate = new Date(transaction.updated_at);
  
  let paymentStatus: ReceiptData['paymentStatus'] = 'paid';
  if (transaction.status === 'refunded') {
    paymentStatus = 'refunded';
  }
  
  return {
    ...invoiceData,
    receiptNumber: generateReceiptNumber(transaction.id, paymentDate),
    paymentMethod,
    paymentDate,
    paymentStatus,
  };
}

/**
 * Generate HTML invoice
 */
export function generateInvoiceHTML(invoiceData: InvoiceData): string {
  const { invoiceNumber, invoiceDate, guest, host, platform, breakdown, booking, notes } = invoiceData;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; padding: 40px; background: #f5f5f5; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #006699; }
    .logo { font-size: 28px; font-weight: bold; color: #006699; }
    .invoice-details { text-align: right; }
    .invoice-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
    .invoice-meta { color: #666; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: bold; color: #006699; margin-bottom: 15px; text-transform: uppercase; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .info-block h3 { font-size: 14px; color: #666; margin-bottom: 8px; }
    .info-block p { font-size: 14px; margin-bottom: 4px; }
    .booking-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .booking-details p { margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #006699; color: white; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
    .text-right { text-align: right; }
    .totals { background: #f9f9f9; padding: 20px; border-radius: 8px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .total-row.grand { font-size: 18px; font-weight: bold; color: #006699; border-top: 2px solid #006699; margin-top: 10px; padding-top: 15px; }
    .notes { background: #fffbea; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px; }
    @media print { body { padding: 0; background: white; } .invoice-container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="logo">${platform.name}</div>
        <p style="color: #666; margin-top: 8px;">${platform.address}</p>
        <p style="color: #666;">TRN: ${platform.taxId}</p>
      </div>
      <div class="invoice-details">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-meta">
          <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
          <p><strong>Date:</strong> ${invoiceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">PAID</span></p>
        </div>
      </div>
    </div>

    <!-- Guest and Host Info -->
    <div class="section">
      <div class="info-grid">
        <div class="info-block">
          <h3>BILLED TO</h3>
          <p><strong>${guest.name}</strong></p>
          <p>${guest.email}</p>
          ${guest.phone ? `<p>${guest.phone}</p>` : ''}
          ${guest.address ? `<p>${guest.address}</p>` : ''}
        </div>
        <div class="info-block">
          <h3>PROPERTY HOST</h3>
          <p><strong>${host.name}</strong></p>
          ${host.businessName ? `<p>${host.businessName}</p>` : ''}
          <p>${host.email}</p>
          ${host.taxId ? `<p>TRN: ${host.taxId}</p>` : ''}
        </div>
      </div>
    </div>

    <!-- Booking Details -->
    ${booking ? `
    <div class="section">
      <div class="section-title">Booking Details</div>
      <div class="booking-details">
        <p><strong>Property:</strong> ${booking.propertyTitle}</p>
        <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Duration:</strong> ${booking.nights} night${booking.nights > 1 ? 's' : ''}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
      </div>
    </div>
    ` : ''}

    <!-- Line Items -->
    <div class="section">
      <div class="section-title">Payment Details</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${booking ? `Accommodation (${booking.nights} night${booking.nights > 1 ? 's' : ''})` : 'Base Amount'}</td>
            <td class="text-right">${formatCurrency(breakdown.baseAmount, 'AED')}</td>
          </tr>
          ${breakdown.cleaningFee > 0 ? `
          <tr>
            <td>Cleaning Fee</td>
            <td class="text-right">${formatCurrency(breakdown.cleaningFee, 'AED')}</td>
          </tr>
          ` : ''}
          <tr>
            <td>Service Fee</td>
            <td class="text-right">${formatCurrency(breakdown.serviceFee, 'AED')}</td>
          </tr>
          <tr>
            <td>VAT (5%)</td>
            <td class="text-right">${formatCurrency(breakdown.vatAmount, 'AED')}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(breakdown.baseAmount + breakdown.cleaningFee, 'AED')}</span>
        </div>
        <div class="total-row">
          <span>Service Fee:</span>
          <span>${formatCurrency(breakdown.serviceFee, 'AED')}</span>
        </div>
        <div class="total-row">
          <span>VAT (5%):</span>
          <span>${formatCurrency(breakdown.vatAmount, 'AED')}</span>
        </div>
        <div class="total-row grand">
          <span>TOTAL PAID:</span>
          <span>${formatCurrency(breakdown.totalAmount, 'AED')}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    ${notes ? `
    <div class="notes">
      <strong>Note:</strong> ${notes}
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p>This is a computer-generated invoice and does not require a signature.</p>
      <p>For any questions regarding this invoice, please contact ${platform.email}</p>
      <p style="margin-top: 10px;">${platform.website}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate HTML receipt (similar to invoice but with payment confirmation)
 */
export function generateReceiptHTML(receiptData: ReceiptData): string {
  const invoiceHTML = generateInvoiceHTML(receiptData);
  
  // Replace "INVOICE" with "RECEIPT" and add payment information
  const receiptHTML = invoiceHTML
    .replace(/INVOICE/g, 'RECEIPT')
    .replace(/Invoice #/g, 'Receipt #')
    .replace(receiptData.invoiceNumber, receiptData.receiptNumber);
  
  // Add payment method info before the booking details section
  const paymentInfo = `
    <div class="section">
      <div class="section-title">Payment Information</div>
      <div class="booking-details">
        <p><strong>Payment Date:</strong> ${receiptData.paymentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Payment Method:</strong> ${receiptData.paymentMethod.brand?.toUpperCase() || receiptData.paymentMethod.type.toUpperCase()} ${receiptData.paymentMethod.last4 ? `****${receiptData.paymentMethod.last4}` : ''}</p>
        <p><strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">${receiptData.paymentStatus.toUpperCase().replace('_', ' ')}</span></p>
        <p><strong>Transaction ID:</strong> ${receiptData.transaction.id}</p>
      </div>
    </div>
  `;
  
  // Insert payment info after the guest/host section
  const insertPosition = receiptHTML.indexOf('<!-- Booking Details -->');
  return receiptHTML.slice(0, insertPosition) + paymentInfo + receiptHTML.slice(insertPosition);
}

/**
 * Download invoice as HTML file
 */
export function downloadInvoice(invoiceData: InvoiceData): void {
  const html = generateInvoiceHTML(invoiceData);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${invoiceData.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download receipt as HTML file
 */
export function downloadReceipt(receiptData: ReceiptData): void {
  const html = generateReceiptHTML(receiptData);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${receiptData.receiptNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Print invoice
 */
export function printInvoice(invoiceData: InvoiceData): void {
  const html = generateInvoiceHTML(invoiceData);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Print receipt
 */
export function printReceipt(receiptData: ReceiptData): void {
  const html = generateReceiptHTML(receiptData);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

