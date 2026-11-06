import './styles.css';
import { render } from './ui/render.js';
import {
  advance,
  answerQuestion,
  continueAfterLevel,
  createInitialState,
  replayCurrentMission,
  restart,
  startMission,
} from './game/gameEngine.js';

const app = document.querySelector('#app');
let state = createInitialState();

function update(nextState, shouldFocus = true) {
  state = nextState;
  app.innerHTML = render(state);
  if (shouldFocus) {
    const heading = app.querySelector('#main-content h1');
    if (heading) requestAnimationFrame(() => heading.focus({ preventScroll: true }));
  }
}

app.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control || control.disabled) return;

  switch (control.dataset.action) {
    case 'start':
      update(startMission(state));
      break;
    case 'answer':
      update(answerQuestion(state, control.dataset.option), false);
      break;
    case 'advance':
      update(advance(state));
      break;
    case 'next-level':
      update(continueAfterLevel(state));
      break;
    case 'replay':
      update(replayCurrentMission(state));
      break;
    case 'restart':
      update(restart(state));
      break;
    case 'home':
      update(restart(state));
      break;
  }
});

update(state, false);
