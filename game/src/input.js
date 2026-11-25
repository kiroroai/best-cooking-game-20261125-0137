// Mouse + keyboard input for Warung Kilat. Maps clicks/keys to state actions
// and plays the matching sound effect. No game logic lives here beyond dispatch.
import { INGREDIENTS } from './recipes.js';
import { addIngredient, clearPlate, matchingOrder, serveOrder, startShift } from './state.js';
import { sfx, toggleMute } from './audio.js';
import {
  PLATE, MUTE_BTN, PAUSE_BTN, START_BTN, RESTART_BTN, TRASH_BTN, SERVE_BTN,
  ticketRect, binRect, inside, insideCircle,
} from './layout.js';

export function attachInput(canvas, state, onPauseToggle) {
  function canvasPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function wrongBuzz() {
    sfx.wrong();
    state.shakeUntil = state.now + 250;
  }

  canvas.addEventListener('click', (event) => {
    sfx.unlock();
    const { x, y } = canvasPos(event);

    if (inside(MUTE_BTN, x, y)) {
      state.muted = toggleMute();
      return;
    }
    if (inside(PAUSE_BTN, x, y)) {
      if (state.mode === 'playing' || state.mode === 'paused') onPauseToggle();
      return;
    }

    if (state.mode === 'title') {
      if (inside(START_BTN, x, y)) {
        sfx.serve();
        startShift(state);
      }
      return;
    }
    if (state.mode === 'over') {
      if (inside(RESTART_BTN, x, y)) {
        sfx.serve();
        startShift(state);
      }
      return;
    }
    if (state.mode !== 'playing') return;

    // Order tickets: serve the plate to the clicked order.
    for (let i = 0; i < 3; i++) {
      if (inside(ticketRect(i), x, y)) {
        const order = state.orders[i];
        if (!order) return;
        const result = serveOrder(state, order.id);
        if (result === 'served') sfx.serve();
        else wrongBuzz();
        return;
      }
    }

    // Ingredient bins: add to the plate.
    for (let i = 0; i < INGREDIENTS.length; i++) {
      if (inside(binRect(i), x, y)) {
        if (addIngredient(state, INGREDIENTS[i].id)) sfx.place();
        else wrongBuzz();
        return;
      }
    }

    if (inside(TRASH_BTN, x, y)) {
      if (clearPlate(state)) sfx.trash();
      else wrongBuzz();
      return;
    }

    if (inside(SERVE_BTN, x, y)) {
      const order = matchingOrder(state);
      if (order && serveOrder(state, order.id) === 'served') sfx.serve();
      else wrongBuzz();
      return;
    }

    if (insideCircle(PLATE.x, PLATE.y, PLATE.r, x, y)) {
      // Clicking the plate itself does nothing, but acknowledge it.
      sfx.pick();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key;
    if (key === 'Enter' && state.mode === 'title') {
      startShift(state);
      sfx.serve();
      return;
    }
    if ((key === 'r' || key === 'R') && state.mode === 'over') {
      startShift(state);
      sfx.serve();
      return;
    }
    if (key === 'p' || key === 'P') {
      if (state.mode === 'playing' || state.mode === 'paused') onPauseToggle();
      return;
    }
    if (key === 'm' || key === 'M') {
      state.muted = toggleMute();
      return;
    }
    if (state.mode !== 'playing') return;
    if (key >= '1' && key <= '8') {
      const ing = INGREDIENTS[Number(key) - 1];
      if (ing && addIngredient(state, ing.id)) sfx.place();
      else wrongBuzz();
      return;
    }
    if (key === ' ') {
      event.preventDefault();
      const order = matchingOrder(state);
      if (order && serveOrder(state, order.id) === 'served') sfx.serve();
      else wrongBuzz();
      return;
    }
    if (key === 'Backspace') {
      if (clearPlate(state)) sfx.trash();
      else wrongBuzz();
    }
  });
}
