// TaskForge OS - Pomodoro Focus Timer Controller (Milestone 5)
import { POMODORO_MODES } from './config.js';
import { state } from './state.js';
import { storage } from './storage.js';

export class PomodoroController {
  constructor() {
    this.container = document.getElementById('pomodoro-container');
    this.currentMode = POMODORO_MODES.WORK;
    this.timeLeft = this.currentMode.duration;
    this.totalDuration = this.currentMode.duration;
    this.isRunning = false;
    this.timerId = null;
    this.selectedTaskId = null;
    this.sessionsCompleted = 0;

    this.circleRadius = 115;
    this.circumference = 2 * Math.PI * this.circleRadius;

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const inProgressTasks = state.tasks.filter(t => t.columnId !== 'col-done');

    this.container.innerHTML = `
      <div class="pomodoro-card">
        <!-- Mode Tabs -->
        <div class="pomodoro-mode-tabs">
          <button class="pomodoro-tab-btn ${this.currentMode.id === 'work' ? 'active' : ''}" data-mode="work">
            Deep Focus (25m)
          </button>
          <button class="pomodoro-tab-btn ${this.currentMode.id === 'short' ? 'active' : ''}" data-mode="short">
            Short Break (5m)
          </button>
          <button class="pomodoro-tab-btn ${this.currentMode.id === 'long' ? 'active' : ''}" data-mode="long">
            Long Break (15m)
          </button>
        </div>

        <!-- SVG Circular Ring -->
        <div class="timer-ring-container">
          <svg class="timer-ring-svg" viewBox="0 0 260 260">
            <circle class="timer-ring-circle-bg" cx="130" cy="130" r="${this.circleRadius}"></circle>
            <circle class="timer-ring-circle-progress" id="timer-progress-circle"
              cx="130" cy="130" r="${this.circleRadius}"
              stroke-dasharray="${this.circumference}"
              stroke-dashoffset="${this.calculateOffset()}">
            </circle>
          </svg>
          <div class="timer-display-content">
            <span class="timer-digits" id="timer-digits-display">${this.formatTime(this.timeLeft)}</span>
            <span class="timer-mode-label" id="timer-mode-label">${this.currentMode.label}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="timer-controls">
          <button class="btn btn-primary btn-timer-primary" id="btn-toggle-timer">
            ${this.isRunning ? 'Pause' : 'Start Focus'}
          </button>
          <button class="btn btn-secondary btn-icon" id="btn-reset-timer" title="Reset Session">
            🔄
          </button>
        </div>

        <!-- Linked Task -->
        <div class="pomodoro-task-picker">
          <label for="pomodoro-task-select">Linked Task (Optional):</label>
          <select id="pomodoro-task-select" class="form-control">
            <option value="">-- No specific task --</option>
            ${inProgressTasks.map(t => `
              <option value="${t.id}" ${this.selectedTaskId === t.id ? 'selected' : ''}>${t.id}: ${escapeHtml(t.title)}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Footer Streak -->
      <div class="pomodoro-sessions-footer">
        <span class="pomodoro-fire-icon">🔥</span>
        <span>Today's Completed Pomodoros: <strong id="pomodoro-count-display">${this.sessionsCompleted}</strong> sessions</span>
      </div>
    `;

    this.bindEvents();
  }

  calculateOffset() {
    const fraction = this.timeLeft / this.totalDuration;
    return this.circumference * (1 - fraction);
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  bindEvents() {
    // Mode Buttons
    this.container.querySelectorAll('.pomodoro-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modeKey = btn.dataset.mode.toUpperCase();
        const modeObj = POMODORO_MODES[modeKey] || (btn.dataset.mode === 'short' ? POMODORO_MODES.SHORT_BREAK : POMODORO_MODES.LONG_BREAK);
        this.switchMode(modeObj);
      });
    });

    // Start / Pause Button
    const toggleBtn = document.getElementById('btn-toggle-timer');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.isRunning) {
          this.pause();
        } else {
          this.start();
        }
      });
    }

    // Reset Button
    const resetBtn = document.getElementById('btn-reset-timer');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    // Task Selector
    const taskSelect = document.getElementById('pomodoro-task-select');
    if (taskSelect) {
      taskSelect.addEventListener('change', (e) => {
        this.selectedTaskId = e.target.value || null;
      });
    }
  }

  switchMode(modeObj) {
    this.pause();
    this.currentMode = modeObj;
    this.totalDuration = modeObj.duration;
    this.timeLeft = modeObj.duration;
    this.render();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const toggleBtn = document.getElementById('btn-toggle-timer');
    if (toggleBtn) {
      toggleBtn.textContent = 'Pause';
      toggleBtn.classList.remove('btn-primary');
      toggleBtn.classList.add('btn-secondary');
    }

    this.timerId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.timerId);

    const toggleBtn = document.getElementById('btn-toggle-timer');
    if (toggleBtn) {
      toggleBtn.textContent = 'Resume';
      toggleBtn.classList.add('btn-primary');
      toggleBtn.classList.remove('btn-secondary');
    }

    document.title = 'TaskForge OS';
  }

  reset() {
    this.pause();
    this.timeLeft = this.totalDuration;
    this.updateDisplay();

    const toggleBtn = document.getElementById('btn-toggle-timer');
    if (toggleBtn) {
      toggleBtn.textContent = 'Start Focus';
      toggleBtn.classList.add('btn-primary');
      toggleBtn.classList.remove('btn-secondary');
    }
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
      this.updateDisplay();
    } else {
      this.completeSession();
    }
  }

  updateDisplay() {
    const digits = document.getElementById('timer-digits-display');
    const circle = document.getElementById('timer-progress-circle');

    const formatted = this.formatTime(this.timeLeft);
    if (digits) digits.textContent = formatted;
    if (circle) circle.style.strokeDashoffset = this.calculateOffset();

    document.title = `${formatted} (${this.currentMode.label}) — TaskForge`;
  }

  completeSession() {
    this.pause();
    this.playChime();

    if (this.currentMode.id === 'work') {
      this.sessionsCompleted += 1;
      storage.savePomodoroSession({
        mode: this.currentMode.id,
        durationMinutes: 25,
        taskId: this.selectedTaskId,
      });

      if (window.TaskForge) {
        window.TaskForge.showToast('🎉 Focus session completed! Take a well-deserved break.', 'success');
      }

      // Auto prompt break
      this.switchMode(POMODORO_MODES.SHORT_BREAK);
    } else {
      if (window.TaskForge) {
        window.TaskForge.showToast('Break finished! Ready for another focus sprint?', 'info');
      }
      this.switchMode(POMODORO_MODES.WORK);
    }
  }

  // Pure Web Audio API Chime Synthesis (Zero external audio files needed)
  playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const notes = [587.33, 880]; // D5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.2);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.2 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.2);
        osc.stop(ctx.currentTime + idx * 0.2 + 0.8);
      });
    } catch (e) {
      console.log('[Pomodoro] Audio chime could not play:', e);
    }
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}
