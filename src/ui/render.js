import { missions, totalQuestions, getRating } from '../data/missions.js';
import { getCurrentMission, getCurrentQuestion, getProgress } from '../game/gameEngine.js';
import { icon } from './icons.js';

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

function brand() {
  return `<a class="brand" href="#home" data-action="home" aria-label="CYBER QUEST — на главную">
    <span class="brand-mark">${icon('shield')}</span>
    <span class="brand-copy"><strong>CYBER <span>QUEST</span></strong><small>ЛАБОРАТОРИЯ ЦИФРОВОЙ БЕЗОПАСНОСТИ</small></span>
  </a>`;
}

function header(state) {
  const progress = getProgress(state);
  const inGame = state.screen !== 'home';
  return `<header class="site-header">
    ${brand()}
    <div class="header-right">
      ${inGame ? `<div class="score-chip"><span class="score-dot"></span><span><b>${progress.score}</b><small> / ${totalQuestions} очков</small></span></div>` : '<span class="session-label"><span class="pulse-dot"></span> УЧЕБНАЯ МИССИЯ</span>'}
      ${state.screen === 'game' || state.screen === 'level-complete' ? `<button class="icon-button" data-action="home" aria-label="Вернуться на главную" title="На главную">${icon('close')}</button>` : ''}
    </div>
  </header>`;
}

function levelCards(active = 0) {
  return missions.map((mission, index) => `<article class="level-card ${index < active ? 'level-card-done' : ''} ${index === active ? 'level-card-current' : ''}">
    <div class="level-card-top"><span class="level-index">0${index + 1}</span><span class="level-icon">${icon(mission.icon)}</span></div>
    <h3>${escapeHtml(mission.title)}</h3>
    <p>${escapeHtml(mission.short)}</p>
    <div class="level-line"><span style="width:${index < active ? '100' : index === active ? '34' : '0'}%"></span></div>
  </article>`).join('');
}

function homeScreen() {
  return `<main id="main-content" class="home-screen">
    <section class="hero-grid">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-line"></span> МИССИЯ ДЛЯ КОМАНДЫ ЦИФРОВОЙ БЕЗОПАСНОСТИ</div>
        <h1>Твоя цифровая<br><span>личность под угрозой.</span></h1>
        <p class="hero-subtitle">Сможешь ли ты защитить её?</p>
        <p class="hero-description">Пять испытаний научат замечать опасность, беречь личные данные и принимать решения без паники.</p>
        <button class="button button-primary button-start" data-action="start">
          <span>Начать миссию</span>${icon('arrow')}
        </button>
        <div class="hero-caption"><span class="caption-lock">${icon('lock')}</span> Никаких настоящих паролей и личных данных</div>
      </div>
      <div class="hero-visual" aria-label="Иллюстрация цифрового щита">
        <div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div>
        <div class="visual-grid"></div>
        <div class="visual-chip chip-top"><span class="chip-dot green"></span> СИСТЕМА ЗАЩИЩЕНА</div>
        <div class="visual-shield"><div class="shield-glow"></div>${icon('shieldOutline', 'shield-graphic')}${icon('lock', 'shield-core')}</div>
        <div class="visual-chip chip-bottom"><span class="chip-lock">${icon('lock')}</span><span><b>ТВОЙ АККАУНТ</b><small>защита активна</small></span><span class="chip-pulse"></span></div>
        <div class="visual-coordinate">ЗАЩИТИ СВОЮ ЦИФРОВУЮ ЖИЗНЬ<br>МИССИЯ 01 — 05</div>
      </div>
    </section>

    <section class="levels-section" aria-labelledby="levels-heading">
      <div class="section-heading">
        <div><span class="eyebrow eyebrow-small">ПЛАН ОПЕРАЦИИ</span><h2 id="levels-heading">Пять шагов к защите</h2></div>
        <div class="section-meta"><span class="meta-icon">${icon('pulse')}</span> ПРОГРЕСС МИССИИ <b>0 / 5</b></div>
      </div>
      <div class="level-grid">${levelCards()}</div>
    </section>

    <section class="learn-strip" aria-label="Чему ты научишься">
      <div class="learn-label"><span class="eyebrow eyebrow-small">ПОСЛЕ МИССИИ ТЫ СМОЖЕШЬ</span><p>Действовать увереннее<br>в цифровом мире.</p></div>
      <div class="learn-item">${icon('key')}<span>Придумывать<br>защиту аккаунтов</span></div>
      <div class="learn-item">${icon('shield')}<span>Распознавать<br>опасные просьбы</span></div>
      <div class="learn-item">${icon('message')}<span>Беречь личные<br>данные</span></div>
      <div class="learn-item">${icon('spark')}<span>Знать, что делать,<br>если что-то не так</span></div>
    </section>
    <footer class="site-footer"><span>CYBER QUEST <i>•</i> ИГРА ДЛЯ КОМАНДЫ</span><span>ИГРОВОЙ ПРОГРЕСС НЕ СОХРАНЯЕТСЯ ПОСЛЕ ЗАКРЫТИЯ СТРАНИЦЫ</span></footer>
  </main>`;
}

function progressHeader(state, mission, question) {
  const progress = getProgress(state);
  const questionTotal = mission.questions.length;
  const percent = Math.round(((state.questionIndex + 1) / questionTotal) * 100);
  return `<section class="mission-progress" aria-label="Прогресс миссии">
    <div class="progress-top"><span>МИССИЯ <b>0${state.levelIndex + 1}</b> <i>/</i> 05</span><span>ВОПРОС <b>0${state.questionIndex + 1}</b> <i>/</i> 0${questionTotal}</span></div>
    <div class="progress-track"><span style="width:${percent}%"></span></div>
    <div class="progress-bottom"><span>Общий прогресс</span><span>${progress.completedLevels} из 5 уровней</span></div>
  </section>`;
}

function missionAside(state) {
  const mission = getCurrentMission(state);
  return `<aside class="mission-aside">
    <div class="aside-label">${icon('pulse')} ТЕКУЩАЯ ОПЕРАЦИЯ</div>
    <div class="aside-level">0${state.levelIndex + 1}<span> / 05</span></div>
    <h2>${escapeHtml(mission.title)}</h2>
    <p>${escapeHtml(mission.descriptionLong || mission.description)}</p>
    <div class="aside-divider"></div>
    <div class="aside-objective"><span class="objective-icon">${icon(mission.icon)}</span><span><b>Твоя задача</b><small>Выбери действие, которое лучше защитит аккаунт</small></span></div>
    <div class="aside-tip"><span class="tip-icon">i</span><p>Ошибаться можно. После каждого ответа будет короткое объяснение, а задание можно пройти ещё раз.</p></div>
  </aside>`;
}

function messageCard(question) {
  return `<div class="chat-window">
    <div class="chat-head"><span class="chat-avatar ${escapeHtml(question.tone)}">${escapeHtml(question.avatar)}</span><span class="chat-person"><b>${escapeHtml(question.sender)}</b><small>${escapeHtml(question.senderMeta)}</small></span><span class="chat-menu">•••</span></div>
    <div class="chat-body"><div class="chat-bubble">${escapeHtml(question.message)}</div>${question.note ? `<div class="message-note">${icon('pulse')}<span>${escapeHtml(question.note)}</span></div>` : ''}</div>
    <div class="chat-foot"><span class="chat-lock">${icon('lock')}</span> Не отвечай, пока не проверил</div>
  </div>`;
}

function answerOptions(question, selectedId) {
  return `<div class="answer-list" role="group" aria-label="Варианты ответа">
    ${question.options.map((option, index) => {
      const selected = selectedId === option.id;
      const correct = selected && option.id === question.correct;
      const wrong = selected && option.id !== question.correct;
      const stateClass = selectedId ? (correct ? 'is-correct' : wrong ? 'is-wrong' : 'is-muted') : '';
      return `<button class="answer-option ${stateClass}" data-action="answer" data-option="${escapeHtml(option.id)}" ${selectedId ? 'disabled' : ''}>
        <span class="option-letter">${String.fromCharCode(65 + index)}</span><span class="option-text">${escapeHtml(option.label)}</span>
        <span class="option-mark">${selectedId ? (correct ? icon('check') : wrong ? icon('close') : '') : icon('arrow')}</span>
      </button>`;
    }).join('')}
  </div>`;
}

function feedbackPanel(question, lastAnswer) {
  const correct = lastAnswer.isCorrect;
  return `<div class="feedback-panel ${correct ? 'feedback-correct' : 'feedback-try'}" role="status" aria-live="polite">
    <span class="feedback-icon">${icon(correct ? 'check' : 'pulse')}</span>
    <div><b>${correct ? 'Верно. Хорошее решение.' : 'Разберём ситуацию вместе.'}</b><p>${escapeHtml(question.explanation)}</p></div>
  </div>`;
}

function questionBody(question) {
  if (question.kind === 'password') {
    return `<div class="password-example"><span class="password-prefix">ПРИМЕР ПАРОЛЯ</span><code>${escapeHtml(question.code)}</code><span class="fiction-label">ВЫДУМАННЫЙ ПРИМЕР</span></div>`;
  }
  if (question.kind === 'message') return messageCard(question);
  if (question.kind === 'sort') {
    return `<div class="sort-card"><div class="sort-card-icon">${icon('book')}</div><span class="sort-card-label">КАРТОЧКА ДАННЫХ</span><b>${escapeHtml(question.card)}</b><small>Куда положишь эту информацию?</small></div>`;
  }
  if (question.diagram) return `<div class="two-factor-flow">${question.diagram.map((step, index) => `<div class="flow-step"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(step)}</b></div>${index < question.diagram.length - 1 ? `<span class="flow-arrow">${icon('arrow')}</span>` : ''}`).join('')}</div>`;
  return '';
}

function gameScreen(state) {
  const mission = getCurrentMission(state);
  const question = getCurrentQuestion(state);
  const chosen = state.lastAnswer?.optionId || null;
  const optionsTitle = question.kind === 'sort' ? 'ВЫБЕРИ КАТЕГОРИЮ' : 'ВЫБЕРИ ОДИН ОТВЕТ';
  const actionLabel = state.questionIndex === mission.questions.length - 1 ? 'Завершить уровень' : 'Следующий вопрос';
  return `<main id="main-content" class="game-screen">
    ${progressHeader(state, mission, question)}
    <div class="game-layout">
      ${missionAside(state)}
      <section class="question-panel" aria-labelledby="question-heading">
        <div class="question-kicker"><span>УРОВЕНЬ 0${state.levelIndex + 1}</span><span class="kicker-separator">/</span><span>${escapeHtml(mission.short)}</span></div>
        <h1 id="question-heading" tabindex="-1">${escapeHtml(question.prompt)}</h1>
        ${questionBody(question)}
        <div class="answer-heading"><span>${optionsTitle}</span><span class="answer-helper">Нажми на подходящий вариант</span></div>
        ${answerOptions(question, chosen)}
        ${state.lastAnswer ? feedbackPanel(question, state.lastAnswer) : ''}
        ${state.lastAnswer ? `<button class="button button-primary continue-button" data-action="advance"><span>${actionLabel}</span>${icon('arrow')}</button>` : ''}
        ${question.kind === 'sort' && !state.lastAnswer ? '<p class="sort-hint">В этой игре сортировать можно нажатием, без перетаскивания.</p>' : ''}
        <div class="question-foot"><span>${icon('lock')} Игра не собирает и не отправляет личные данные</span><span>${state.questionIndex + 1} / ${mission.questions.length}</span></div>
      </section>
    </div>
  </main>`;
}

function levelCompleteScreen(state) {
  const mission = getCurrentMission(state);
  const correct = mission.questions.filter((question) => state.answers[question.id]).length;
  const completeLast = state.levelIndex === missions.length - 1;
  return `<main id="main-content" class="interstitial-screen">
    ${progressHeader(state, mission, mission.questions.at(-1))}
    <section class="result-card level-result">
      <div class="result-orb">${icon('shieldPlus')}<span>0${state.levelIndex + 1}</span></div>
      <span class="eyebrow eyebrow-small">УРОВЕНЬ ЗАВЕРШЁН</span>
      <h1>${escapeHtml(mission.title)}</h1>
      <p class="result-copy">Отличная работа. Ошибки — часть обучения: ты уже знаешь, как действовать безопаснее.</p>
      <div class="level-score"><span>${icon('check')} Правильных ответов на уровне</span><b>${correct}<small> / ${mission.questions.length}</small></b></div>
      <div class="result-actions">
        <button class="button button-secondary" data-action="replay">${icon('restart')}<span>Повторить уровень</span></button>
        <button class="button button-primary" data-action="next-level"><span>${completeLast ? 'Посмотреть результат' : 'Следующий уровень'}</span>${icon('arrow')}</button>
      </div>
    </section>
    <div class="level-mini-grid">${levelCards(state.levelIndex + 1)}</div>
  </main>`;
}

function finalScreen(state) {
  const score = Object.values(state.answers).filter(Boolean).length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const rating = getRating(percentage);
  return `<main id="main-content" class="interstitial-screen final-screen">
    <div class="final-spark spark-a">✦</div><div class="final-spark spark-b">✧</div>
    <section class="result-card final-result">
      <div class="result-orb final-orb">${icon('spark')}<span>${percentage}%</span></div>
      <span class="eyebrow eyebrow-small">МИССИЯ ВЫПОЛНЕНА</span>
      <h1>${escapeHtml(rating)}</h1>
      <p class="result-copy">Ты прошёл все испытания. Забирай это знание с собой и помогай друзьям защищать аккаунты.</p>
      <div class="final-score-row"><div><span>РЕЗУЛЬТАТ</span><b>${score}<small> / ${totalQuestions}</small></b></div><div><span>ПРОЙДЕНО</span><b>05<small> / 05 уровней</small></b></div><div><span>СТАТУС</span><b class="status-clear">ЗАЩИЩЁН</b></div></div>
      <div class="rating-meter"><div class="rating-meter-fill" style="width:${percentage}%"></div></div>
      <p class="rating-caption">Рейтинг зависит от ответов, но проигрыша нет: миссию можно повторить и закрепить знания.</p>
      <button class="button button-primary restart-button" data-action="restart">${icon('restart')}<span>Начать заново</span></button>
    </section>
    <div class="final-reminder">${icon('shield')}<span>Пароли и коды не передают даже знакомым. Важные уведомления проверяют в официальном сервисе.</span></div>
  </main>`;
}

export function render(state) {
  let screen;
  if (state.screen === 'home') screen = homeScreen();
  else if (state.screen === 'game') screen = gameScreen(state);
  else if (state.screen === 'level-complete') screen = levelCompleteScreen(state);
  else screen = finalScreen(state);
  return `<div class="app-shell">${header(state)}${screen}</div>`;
}
