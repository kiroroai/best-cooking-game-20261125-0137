// Fixed layout geometry for the 1280x800 canvas, shared by render and input
// so clicks always land where the drawing says they do.
export const W = 1280;
export const H = 800;

export const HEADER = { x: 0, y: 0, w: 1280, h: 64 };
export const BOARD = { x: 24, y: 76, w: 1232, h: 128 };
export const KITCHEN = { x: 24, y: 216, w: 1232, h: 320 };
export const COUNTERS = { x: 24, y: 552, w: 1232, h: 196 };
export const FOOTER = { x: 0, y: 756, w: 1280, h: 44 };

// Order ticket cards on the board (up to 3).
export function ticketRect(i) {
  return { x: 48 + i * 408, y: 108, w: 384, h: 84 };
}

// Ingredient bins along the counter (8 across, buttons at the far right).
export function binRect(i) {
  return { x: 40 + i * 132, y: 596, w: 118, h: 128 };
}

// The big assembly plate in the middle of the kitchen.
export const PLATE = { x: 640, y: 376, r: 108 };
// Stove (left) and serving pass (right) in the kitchen.
export const STOVE = { x: 120, y: 280, w: 300, h: 200 };
export const PASS = { x: 900, y: 280, w: 260, h: 200 };
// Buttons.
export const TRASH_BTN = { x: 1100, y: 596, w: 140, h: 56 };
export const SERVE_BTN = { x: 1100, y: 664, w: 140, h: 60 };
export const MUTE_BTN = { x: 1130, y: 12, w: 64, h: 40 };
export const PAUSE_BTN = { x: 1200, y: 12, w: 64, h: 40 };
export const START_BTN = { x: 490, y: 470, w: 300, h: 72 };
export const RESTART_BTN = { x: 490, y: 560, w: 300, h: 72 };

export function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

export function insideCircle(cx, cy, r, x, y) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}
