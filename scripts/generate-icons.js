import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

function createIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const radius = isMaskable ? size / 2 : size / 2 - 4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!isMaskable && dist > radius) {
        // Transparent outside rounded icon
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
        continue;
      }

      // Background gradient (Deep Slate #0f172a to #020617)
      const gradRatio = (x + y) / (size * 2);
      let r = Math.round(15 * (1 - gradRatio) + 2 * gradRatio);
      let g = Math.round(23 * (1 - gradRatio) + 6 * gradRatio);
      let b = Math.round(42 * (1 - gradRatio) + 23 * gradRatio);
      let a = 255;

      // Outer gold ring
      const ringDist = Math.abs(dist - size * 0.38);
      if (ringDist < size * 0.015) {
        r = 245; g = 158; b = 11; // Amber Gold
      }

      // Center Dining Cloche Dome drawing
      const clocheRadius = size * 0.22;
      const clocheCenterY = size * 0.52;
      const clocheDist = Math.sqrt(dx * dx + (y - clocheCenterY) * (y - clocheCenterY));
      
      // Dome top half
      if (clocheDist <= clocheRadius && y <= clocheCenterY) {
        r = 251; g = 191; b = 36; // Bright Gold
      }

      // Top handle
      const knobDist = Math.sqrt(dx * dx + (y - (clocheCenterY - clocheRadius - size * 0.03)) * (y - (clocheCenterY - clocheRadius - size * 0.03)));
      if (knobDist < size * 0.04) {
        r = 239; g = 68; b = 68; // Flame Red knob
      }

      // Base tray plate
      if (y >= clocheCenterY + 2 && y <= clocheCenterY + size * 0.04 && Math.abs(dx) <= size * 0.28) {
        r = 245; g = 158; b = 11;
      }

      // Tray lower rim
      if (y >= clocheCenterY + size * 0.05 && y <= clocheCenterY + size * 0.07 && Math.abs(dx) <= size * 0.18) {
        r = 217; g = 119; b = 6;
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return png;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 192x192
const icon192 = createIcon(192);
icon192.pack().pipe(fs.createWriteStream(path.join(publicDir, 'pwa-192x192.png')));

// 512x512
const icon512 = createIcon(512);
icon512.pack().pipe(fs.createWriteStream(path.join(publicDir, 'pwa-512x512.png')));

// Maskable 512x512
const maskable512 = createIcon(512, true);
maskable512.pack().pipe(fs.createWriteStream(path.join(publicDir, 'pwa-maskable-512x512.png')));

// Apple Touch Icon 180x180
const apple180 = createIcon(180);
apple180.pack().pipe(fs.createWriteStream(path.join(publicDir, 'apple-touch-icon.png')));

console.log('Successfully generated all PWA icons in public/');
