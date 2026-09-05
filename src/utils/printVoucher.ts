export function printOrderTokenVoucher(order: {
  tokenNumber: string;
  stallName: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  placedAt: string;
  pickupMethod?: string;
  studentName?: string;
  rollNo?: string;
}) {
  const printWindow = window.open('', '_blank', 'width=600,height=700');
  if (!printWindow) {
    window.print();
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px dashed #cbd5e1;">
      <td style="padding: 6px 0; font-size: 13px;">${item.name} x ${item.quantity}</td>
      <td style="padding: 6px 0; text-align: right; font-size: 13px; font-weight: bold;">₹${item.price * item.quantity}</td>
    </tr>
  `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Token #${order.tokenNumber} - LPU Food Court</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            padding: 24px;
            color: #0f172a;
            max-width: 400px;
            margin: 0 auto;
          }
          .header { text-align: center; border-bottom: 2px dashed #0f172a; padding-bottom: 12px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: bold; margin: 0; }
          .subtitle { font-size: 11px; margin: 4px 0 0 0; color: #475569; }
          .token-box {
            text-align: center;
            background: #f1f5f9;
            padding: 12px;
            border-radius: 8px;
            margin: 12px 0;
            border: 2px solid #0f172a;
          }
          .token-title { font-size: 11px; font-weight: bold; margin: 0; text-transform: uppercase; }
          .token-num { font-size: 32px; font-weight: 900; margin: 4px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          .total { font-size: 16px; font-weight: bold; border-top: 2px dashed #0f172a; padding-top: 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 8px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">LOVELY PROFESSIONAL UNIVERSITY</h1>
          <p class="subtitle">UniMall Food Court & Dining Services, Phagwara</p>
          <p style="font-size: 12px; font-weight: bold; margin-top: 6px;">Stall: ${order.stallName}</p>
        </div>

        <div class="token-box">
          <p class="token-title">Order Pickup Token</p>
          <div class="token-num">#${order.tokenNumber}</div>
          <p style="font-size: 11px; margin: 0;">Time: ${order.placedAt} | Mode: ${order.pickupMethod || 'Counter Pickup'}</p>
        </div>

        <p style="font-size: 12px; margin: 4px 0;"><strong>Student:</strong> ${order.studentName || 'Campus Student'} (${order.rollNo || 'Verto'})</p>

        <table class="table">
          <thead>
            <tr style="border-bottom: 1px solid #0f172a; text-align: left; font-size: 11px; text-transform: uppercase;">
              <th style="padding-bottom: 4px;">Item</th>
              <th style="padding-bottom: 4px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between;" class="total">
          <span>TOTAL PAID</span>
          <span>₹${order.totalAmount}</span>
        </div>

        <div class="footer">
          <p>Please present this token at the counter when called.</p>
          <p>Thank you for choosing LPU Dining Portal!</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
