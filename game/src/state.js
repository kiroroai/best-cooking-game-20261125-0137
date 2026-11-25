// Game state and rules for Warung Kilat: orders, plate, score, combo, timers.
// Pure logic: no DOM, no canvas here, so the rules are easy to test and read.
import { DISHES, ING_BY_ID, plateMatches } from './recipes.js';
import { mulberry32, pick } from './rng.js';

export const SHIFT_SECONDS = 180;
export const MAX_ORDERS = 3;
export const MAX_MISSES = 3;
export const ORDER_SPAWN_EVERY = 9; // seconds between new orders, shrinking as the rush grows

export function newGame(seed = 20261125) {
  const rng = mulberry32(seed);
  const state = {
    seed,
    rng,
    mode: 'title', // title | playing | paused | over | shot
    score: 0,
    served: 0,
    combo: 0,
    bestCombo: 0,
    misses: 0,
    shiftLeft: SHIFT_SECONDS,
    elapsed: 0,
    spawnIn: 1.5,
    orders: [], // { id, dishId, left, total, born }
    plate: [], // ingredient ids currently on the assembly plate
    pass: null, // last served dish id shown on the serving pass
    flash: null, // { text, until } floating feedback
    shakeUntil: 0,
    muted: false,
    nextOrderId: 1,
    now: 0, // ms clock driven by the loop
  };
  return state;
}

export function startShift(state) {
  state.mode = 'playing';
  state.score = 0;
  state.served = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.misses = 0;
  state.shiftLeft = SHIFT_SECONDS;
  state.elapsed = 0;
  state.spawnIn = 0.5;
  state.orders = [];
  state.plate = [];
  state.pass = null;
  state.flash = null;
  state.nextOrderId = 1;
  spawnOrder(state);
  spawnOrder(state);
}

export function rushLevel(state) {
  // 0 at the start, up to 3 near the end of the shift: orders arrive faster and hotter.
  return Math.min(3, Math.floor(state.elapsed / 60));
}

export function spawnOrder(state) {
  if (state.orders.length >= MAX_ORDERS) return null;
  const dish = pick(state.rng, DISHES);
  const heat = rushLevel(state);
  const total = Math.max(26, dish.time - heat * 4);
  const order = {
    id: state.nextOrderId++,
    dishId: dish.id,
    left: total,
    total,
    born: state.elapsed,
  };
  state.orders.push(order);
  return order;
}

export function addIngredient(state, ingId) {
  if (state.mode !== 'playing') return false;
  if (!ING_BY_ID[ingId]) return false;
  if (state.plate.length >= 5) return false;
  state.plate.push(ingId);
  return true;
}

export function clearPlate(state) {
  if (state.mode !== 'playing') return false;
  if (state.plate.length === 0) return false;
  state.plate = [];
  return true;
}

// Serve the plate to the given order. Returns 'served' | 'nomatch' | 'noorder'.
export function serveOrder(state, orderId) {
  if (state.mode !== 'playing') return 'noorder';
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return 'noorder';
  const dish = DISHES.find((d) => d.id === order.dishId);
  if (!plateMatches(state.plate, dish)) return 'nomatch';
  const timeBonus = Math.round((order.left / order.total) * 60);
  const comboBonus = state.combo * 10;
  const gained = dish.points + timeBonus + comboBonus;
  state.score += gained;
  state.served += 1;
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.pass = dish.id;
  state.plate = [];
  state.orders = state.orders.filter((o) => o.id !== orderId);
  state.flash = { text: `+${gained}  ${dish.name} tersaji!`, until: state.now + 1400, kind: 'good' };
  return 'served';
}

// First order the current plate matches, if any (for the keyboard serve key).
export function matchingOrder(state) {
  return state.orders.find((order) => {
    const dish = DISHES.find((d) => d.id === order.dishId);
    return plateMatches(state.plate, dish);
  }) || null;
}

export function tick(state, dtMs) {
  if (state.mode !== 'playing') return;
  const dt = dtMs / 1000;
  state.now += dtMs;
  state.elapsed += dt;
  state.shiftLeft = Math.max(0, SHIFT_SECONDS - state.elapsed);

  for (const order of state.orders) order.left -= dt;
  const expired = state.orders.filter((o) => o.left <= 0);
  if (expired.length > 0) {
    state.orders = state.orders.filter((o) => o.left > 0);
    state.misses += expired.length;
    state.combo = 0;
    state.flash = { text: 'Pesanan hangus! Pelanggan pergi...', until: state.now + 1600, kind: 'bad' };
  }

  state.spawnIn -= dt;
  if (state.spawnIn <= 0 && state.orders.length < MAX_ORDERS) {
    spawnOrder(state);
    state.spawnIn = Math.max(4, ORDER_SPAWN_EVERY - rushLevel(state) * 1.5);
  }

  if (state.flash && state.now > state.flash.until) state.flash = null;
  if (state.misses >= MAX_MISSES || state.shiftLeft <= 0) {
    state.mode = 'over';
  }
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
