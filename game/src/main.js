// Entry point for Warung Kilat: boot, game loop, pause handling, screenshot mode.
// ?shot=<name> renders one frozen staged frame (see shots.js) instead of playing.
import { draw } from './render.js';
import { attachInput } from './input.js';
import { newGame, startShift, tick } from './state.js';
import { stageShot } from './shots.js';
import { sfx } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const seedParam = Number(params.get('seed') || '20261125');

let state;
if (shotName) {
  state = stageShot(shotName) || newGame(seedParam);
  state.mode = 'shot';
  draw(ctx, state);
  document.title = `Warung Kilat — shot ${shotName}`;
} else {
  state = newGame(seedParam);
  attachInput(canvas, state, () => {
    if (state.mode === 'playing') {
      state.mode = 'paused';
    } else if (state.mode === 'paused') {
      state.mode = 'playing';
    }
  });

  let last = performance.now();
  let lastTickSecond = -1;
  function frame(now) {
    const dt = Math.min(100, now - last);
    last = now;
    if (state.mode === 'playing') {
      const before = Math.ceil(state.shiftLeft);
      tick(state, dt);
      const after = Math.ceil(state.shiftLeft);
      if (after !== before && after <= 10 && after > 0) sfx.tick();
      const sec = Math.floor(state.elapsed);
      if (sec !== lastTickSecond) {
        lastTickSecond = sec;
        // Urgency tick when any order is about to expire.
        if (state.orders.some((o) => o.left <= 5.5 && o.left > 4.5)) sfx.tick();
      }
      if (state.mode === 'over') sfx.gameover();
    }
    draw(ctx, state);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
