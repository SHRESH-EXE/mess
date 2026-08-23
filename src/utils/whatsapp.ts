import { AcademicBlockOrder, DayScholarOrder } from '../types/mess';

export function formatWhatsAppOrderMessage(order: Omit<AcademicBlockOrder, 'id' | 'orderTime' | 'status'> & { orderId?: string }): string {
  const itemsText = order.items
    .filter(it => it.quantity > 0)
    .map(it => `• *${it.dishName}* x ${it.quantity} ${it.price > 0 ? `(₹${it.price * it.quantity})` : '(Included in Mess Pass)'}`)
    .join('\n');

  const lines = [
    `*MESS - ACADEMIC PARCEL ORDER*`,
    order.orderId ? `*Order ID:* \`#${order.orderId}\`` : '',
    `----------------------------------------`,
    `*Student Name:* ${order.studentName}`,
    order.rollNo ? `*Roll No:* ${order.rollNo}` : '',
    `*Phone:* ${order.phone}`,
    `*Delivery Location:* ${order.blockName}`,
    `*Room / Floor / Desk:* ${order.roomFloor}`,
    `*Requested Batch:* ${order.deliverySlot}`,
    `*Packaging:* ${order.packingType}`,
    `*Payment/Billing:* ${order.useMessPass ? 'Active Mess Pass (Meal Count Deducted)' : `Direct Pay on Delivery (Total: ₹${order.totalAmount})`}`,
    ``,
    `*ORDERED ITEMS:*`,
    itemsText || '• 1x Full Standard Thali / Snack Pack',
    ``,
    order.notes ? `*Special Instructions:* ${order.notes}\n` : '',
    `----------------------------------------`,
    `*Mess Kitchen:* Campus Central Dining Hall, Ground Floor`,
    `_Sent via MESS Portal_`
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateWhatsAppLink(
  phoneNumber: string,
  order: Omit<AcademicBlockOrder, 'id' | 'orderTime' | 'status'> & { orderId?: string }
): string {
  // Clean phone number: remove +, -, spaces
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const message = formatWhatsAppOrderMessage(order);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function formatDayScholarWhatsAppMessage(order: DayScholarOrder): string {
  const itemsText = order.items
    .filter(it => it.quantity > 0)
    .map(it => `• *${it.dishName}* x ${it.quantity} (₹${it.price * it.quantity})`)
    .join('\n');

  const lines = [
    `*MESS - DAY SCHOLAR ORDER*`,
    `*Order ID:* \`#${order.id}\``,
    `----------------------------------------`,
    `*Student Name:* ${order.name}`,
    `*Phone:* ${order.phoneNumber}`,
    `*Department / Course:* ${order.department || 'Day Scholar Student'}`,
    `*Meal Slot:* ${order.mealSlot.toUpperCase()}`,
    `*Fulfillment:* ${order.preference === 'delivery' ? `Deliver to ${order.blockName} (${order.roomFloor})` : 'Self-Pickup from Counter 3 (Day Scholar Express)'}`,
    `*Pay-Per-Order Bill:* *₹${order.totalAmount}* (Pay at Counter / UPI on Delivery)`,
    ``,
    `*ORDERED ITEMS:*`,
    itemsText || '• 1x Custom Day Scholar Selection',
    ``,
    order.specialNotes ? `*Special Notes:* ${order.specialNotes}\n` : '',
    `----------------------------------------`,
    `*Mess Kitchen:* Campus Central Dining Complex`,
    `_Sent via MESS Day Scholar Portal_`
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateDayScholarWhatsAppLink(
  phoneNumber: string,
  order: DayScholarOrder
): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const message = formatDayScholarWhatsAppMessage(order);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

