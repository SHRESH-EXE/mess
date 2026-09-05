/**
 * UPI Payment utilities for Indian Campus & UniMall Food Court transactions
 */

export interface UpiPaymentDetails {
  vpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  orderId: string;
}

export const DEFAULT_CAMPUS_UPI_VPA = 'campusfoodcourt@icici';
export const DEFAULT_PAYEE_NAME = 'LPU UniMall Food Court';

/**
 * Generate standard UPI Intent URI (compatible with GPay, PhonePe, Paytm, BHIM)
 */
export function generateUpiIntentUri(details: UpiPaymentDetails): string {
  const params = new URLSearchParams({
    pa: details.vpa || DEFAULT_CAMPUS_UPI_VPA,
    pn: details.payeeName || DEFAULT_PAYEE_NAME,
    tn: details.transactionNote || `Order ${details.orderId}`,
    am: details.amount.toFixed(2),
    cu: 'INR'
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Generate a dynamic QR code image URL for instant UPI scanning
 */
export function generateUpiQrCodeUrl(details: UpiPaymentDetails, size: number = 240): string {
  const intentUri = generateUpiIntentUri(details);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(intentUri)}&format=svg`;
}
