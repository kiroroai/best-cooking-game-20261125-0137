// Deterministic screenshot staging for Warung Kilat.
// ?shot=cover|mid|rush|serve builds a frozen, fully-played frame from the game's
// own state and renderer — the same code path the live game uses, no mock drawing.
// Timers are frozen (mode 'shot') so headless captures are stable.
import { DISH_BY_ID } from './recipes.js';
import { newGame, spawnOrder } from './state.js';

function baseState(seed) {
  const state = newGame(seed);
  state.mode = 'shot';
  state.score = 0;
  state.served = 0;
  state.combo = 0;
  state.orders = [];
  state.plate = [];
  state.pass = null;
  state.flash = null;
  return state;
}

function forceOrder(state, dishId, left, total) {
  const order = spawnOrder(state);
  if (!order) return null;
  order.dishId = dishId;
  order.left = left;
  order.total = total;
  return order;
}

export function stageShot(name) {
  if (name === 'cover') {
    // The full story in one frame: busy order board, mid-assembly plate,
    // a finished dish on the pass, counters loaded, one timer nearly out.
    const s = baseState(11);
    s.score = 340;
    s.served = 3;
    s.combo = 3;
    s.bestCombo = 4;
    s.shiftLeft = 112;
    s.elapsed = 68;
    forceOrder(s, 'nasgor', 9, 45); // urgent, almost out of time
    forceOrder(s, 'miegor', 28, 45);
    forceOrder(s, 'mieayam', 38, 42);
    s.plate = ['nasi', 'telur']; // Nasi Goreng Kilat mid-assembly (needs nasi, telur, ayam, kecap)
    s.pass = 'nasitelur';
    s.flash = { text: '+180  Nasi Telur Dadar tersaji!', until: 1e9, kind: 'good' };
    return s;
  }
  if (name === 'mid') {
    // Mid-shift action: two orders cooking, plate half built, combo building.
    const s = baseState(23);
    s.score = 180;
    s.served = 2;
    s.combo = 2;
    s.bestCombo = 2;
    s.shiftLeft = 148;
    s.elapsed = 32;
    forceOrder(s, 'mieayam', 30, 42);
    forceOrder(s, 'nasayur', 22, 40);
    s.plate = ['mie', 'ayam', 'sayur']; // Mie Ayam Warung nearly complete
    return s;
  }
  if (name === 'rush') {
    // Late-shift rush: three orders, timers low, high combo, high score.
    const s = baseState(37);
    s.score = 890;
    s.served = 8;
    s.combo = 5;
    s.bestCombo = 6;
    s.shiftLeft = 24;
    s.elapsed = 156;
    forceOrder(s, 'miepedas', 7, 48);
    forceOrder(s, 'nasgor', 14, 45);
    forceOrder(s, 'miegor', 19, 45);
    s.plate = ['mie', 'cabai'];
    s.pass = 'miegor';
    s.flash = { text: 'KOMBO x5! Terus sajikan!', until: 1e9, kind: 'good' };
    return s;
  }
  if (name === 'serve') {
    // The money moment: plate exactly matches the first order, gold SIAP SAJIKAN.
    const s = baseState(51);
    s.score = 460;
    s.served = 4;
    s.combo = 4;
    s.bestCombo = 4;
    s.shiftLeft = 96;
    s.elapsed = 84;
    forceOrder(s, 'nasgor', 26, 45);
    forceOrder(s, 'mieayam', 33, 42);
    s.plate = ['nasi', 'telur', 'ayam', 'kecap']; // exact Nasi Goreng Kilat
    s.pass = 'mieayam';
    return s;
  }
  return null;
}

export function shotNames() {
  return ['cover', 'mid', 'rush', 'serve'];
}

export { DISH_BY_ID };
