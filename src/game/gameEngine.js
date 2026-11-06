import { missions, totalQuestions } from '../data/missions.js';

export function createInitialState() {
  return {
    screen: 'home',
    levelIndex: 0,
    questionIndex: 0,
    answers: {},
    lastAnswer: null,
  };
}

export function getCurrentMission(state) {
  return missions[state.levelIndex];
}

export function getCurrentQuestion(state) {
  return getCurrentMission(state).questions[state.questionIndex];
}

export function getScore(state) {
  return Object.values(state.answers).filter(Boolean).length;
}

export function getAnsweredCount(state) {
  return Object.keys(state.answers).length;
}

export function answerQuestion(state, optionId) {
  if (state.screen !== 'game' || state.lastAnswer) return state;
  const question = getCurrentQuestion(state);
  if (!question.options.some((option) => option.id === optionId)) return state;
  const isCorrect = optionId === question.correct;
  return {
    ...state,
    answers: { ...state.answers, [question.id]: isCorrect },
    lastAnswer: { optionId, isCorrect },
  };
}

export function advance(state) {
  if (!state.lastAnswer) return state;
  const mission = getCurrentMission(state);
  if (state.questionIndex < mission.questions.length - 1) {
    return { ...state, questionIndex: state.questionIndex + 1, lastAnswer: null };
  }
  return { ...state, screen: 'level-complete', lastAnswer: null };
}

export function startMission(state) {
  return { ...state, screen: 'game', levelIndex: 0, questionIndex: 0, lastAnswer: null };
}

export function continueAfterLevel(state) {
  const nextIndex = state.levelIndex + 1;
  if (nextIndex >= missions.length) return { ...state, screen: 'final', lastAnswer: null };
  return { ...state, screen: 'game', levelIndex: nextIndex, questionIndex: 0, lastAnswer: null };
}

export function replayCurrentMission(state) {
  const mission = getCurrentMission(state);
  const answers = { ...state.answers };
  mission.questions.forEach(({ id }) => delete answers[id]);
  return { ...state, screen: 'game', questionIndex: 0, answers, lastAnswer: null };
}

export function restart(state) {
  return createInitialState();
}

export function getProgress(state) {
  const completed = state.screen === 'level-complete' ? state.levelIndex + 1 : state.levelIndex;
  return {
    completedLevels: completed,
    totalLevels: missions.length,
    percentage: Math.round((completed / missions.length) * 100),
    score: getScore(state),
    totalQuestions,
    answered: getAnsweredCount(state),
  };
}
