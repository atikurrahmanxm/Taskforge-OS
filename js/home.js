// TaskForge OS - Workspace Overview & Home Controller
import { state, bus, EVENTS } from './state.js';
import { PRIORITIES, VIEWS } from './config.js';
import { taskModal } from './taskModal.js';
import { storage } from './storage.js';

export class HomeController {
  constructor() {
    this.container = document.getElementById('home-container');
    this.init();
  }

  init() {
    bus.subscribe(EVENTS.STATE_INITIALIZED, () => this.render());
    bus.subscribe(EVENTS.TASKS_CHANGED, () => this.render());
    bus.subscribe(EVENTS.SPRINT_CHANGED, () => this.render());

    this.render();
  }

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  getFormattedDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  }

  render() {
    if (!this.container) return;

    const tasks = state.tasks;
    const activeSprint = state.sprints.find(s => s.id === state.activeSprintId) || {
      name: 'Sprint 1',
      goal: 'Deliver core workstation MVP',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };

    const sprintTasks = tasks.filter(t => t.sprintId === state.activeSprintId);
    const sprintDone = sprintTasks.filter(t => t.columnId === 'col-done').length;
    const sprintPct = sprintTasks.length > 0 ? Math.round((sprintDone / sprintTasks.length) * 100) : 0;

    const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.columnId !== 'col-done');
    const wipTasks = tasks.filter(t => t.columnId === 'col-in-progress' || t.columnId === 'col-review');

    // Pomodoro Hours
    const pomoHistory = storage.getPomodoroHistory();
    const pomoMinutes = pomoHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
    const pomoHours = (pomoMinutes / 60).toFixed(1);

    // Priority Action Items (Urgent/High or In Progress, not done)
    const actionItems = tasks
      .filter(t => t.columnId !== 'col-done')
      .sort((a, b) => {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priority] || 2) - (order[b.priority] || 2);
      })
      .slice(0, 5);

    this.container.innerHTML = `
      <div class="home-layout-container">
        <!-- 1. Hero Welcome Banner -->
        <div class="home-hero-card">
          <div class="hero-left">
            <div class="hero-greeting-line">
              <h1 class="hero-greeting">${this.getGreeting()}, Developer 👋</h1>
              <span class="hero-sprint-pill">
                <span>🏃</span> ${escapeHtml(activeSprint.name)} • Active
              </span>
            </div>
            <p class="hero-subtitle">
              Welcome to your engineering workstation. Track sprints, manage Kanban cards, and maintain deep focus.
            </p>
            <div class="hero-date-badge">
              <span>📅 ${this.getFormattedDate()}</span>
            </div>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" id="btn-hero-new-task">
              <span>+</span> New Task
            </button>
            <button class="btn btn-secondary" id="btn-hero-start-pomo">
              <span>⏱️</span> Quick Focus (25m)
            </button>
          </div>
        </div>

        <!-- 2. Executive KPI Metrics Ribbon -->
        <div class="home-kpi-grid">
          <div class="home-kpi-card" data-jump="sprint">
            <div class="kpi-top">
              <span>Sprint Velocity</span>
              <div class="kpi-icon-badge" style="background: rgba(99, 102, 241, 0.15); color: #818cf8;">🎯</div>
            </div>
            <div class="kpi-val">${sprintPct}%</div>
            <div class="kpi-subtext">${sprintDone} of ${sprintTasks.length} tasks completed</div>
            <div class="progress-track" style="height: 4px; margin-top: 4px;">
              <div class="progress-fill" style="width: ${sprintPct}%; background: var(--color-primary);"></div>
            </div>
          </div>

          <div class="home-kpi-card" data-jump="kanban">
            <div class="kpi-top">
              <span>Urgent Attention</span>
              <div class="kpi-icon-badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">🔥</div>
            </div>
            <div class="kpi-val">${urgentTasks.length}</div>
            <div class="kpi-subtext">Critical & high priority items</div>
          </div>

          <div class="home-kpi-card" data-jump="kanban">
            <div class="kpi-top">
              <span>Active WIP Load</span>
              <div class="kpi-icon-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">⚡</div>
            </div>
            <div class="kpi-val">${wipTasks.length}</div>
            <div class="kpi-subtext">Tasks in progress or review</div>
          </div>

          <div class="home-kpi-card" data-jump="pomodoro">
            <div class="kpi-top">
              <span>Focus Logged</span>
              <div class="kpi-icon-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">⏱️</div>
            </div>
            <div class="kpi-val">${pomoHours}h</div>
            <div class="kpi-subtext">${pomoHistory.length} sessions completed</div>
          </div>
        </div>

        <!-- 3. Dashboard Two-Column Grid -->
        <div class="home-dashboard-grid">
          <!-- Main Column -->
          <div class="home-main-col">
            <!-- Priority Action Items -->
            <div class="action-items-card">
              <div class="section-card-header">
                <h2 class="section-card-title">
                  <span>🔥</span> Priority Action Items
                </h2>
                <button class="btn btn-outline btn-sm" id="btn-view-all-board">
                  View Full Board ➔
                </button>
              </div>

              <div class="action-tasks-list">
                ${actionItems.length === 0 ? `
                  <div style="padding: 20px; text-align: center; color: var(--text-dim); font-size: 0.88rem;">
                    🎉 All caught up! No high-priority blockers currently pending.
                  </div>
                ` : actionItems.map(task => this.renderActionTask(task)).join('')}
              </div>
            </div>

            <!-- Workstation Quick Launchpad -->
            <div class="launchpad-card">
              <div class="section-card-header">
                <h2 class="section-card-title">
                  <span>🚀</span> Workstation Launchpad
                </h2>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Instant Navigation</span>
              </div>

              <div class="launchpad-grid">
                <div class="launch-tile" data-jump="kanban">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #6366f1;">📋</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">${tasks.length} tasks</span>
                  </div>
                  <h4>Kanban Board</h4>
                  <p>Drag and drop cards across Backlog, In Progress, Review, and Done stages.</p>
                  <div class="launch-tile-cta">Open Board ➔</div>
                </div>

                <div class="launch-tile" data-jump="sprint">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #38bdf8;">🏃</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">${sprintTasks.length} in sprint</span>
                  </div>
                  <h4>Sprint Planner</h4>
                  <p>Manage sprint capacity, shift items from product backlog, track sprint goals.</p>
                  <div class="launch-tile-cta">View Sprint ➔</div>
                </div>

                <div class="launch-tile" data-jump="pomodoro">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #f59e0b;">⏱️</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">25m / 5m</span>
                  </div>
                  <h4>Pomodoro Timer</h4>
                  <p>Block distractions with structured intervals and synthesized audio chimes.</p>
                  <div class="launch-tile-cta">Start Timer ➔</div>
                </div>

                <div class="launch-tile" data-jump="analytics">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #10b981;">📊</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">Live metrics</span>
                  </div>
                  <h4>Velocity Analytics</h4>
                  <p>Inspect team throughput, priority distributions, and pipeline bottlenecks.</p>
                  <div class="launch-tile-cta">Inspect Velocity ➔</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Side Column -->
          <div class="home-side-col">
            <!-- Active Sprint Radar -->
            <div class="home-side-card">
              <div class="section-card-header">
                <h3 style="font-size: 1rem; font-weight: 700;">🎯 Sprint Radar</h3>
                <span class="badge badge-priority-low">Active</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted);">
                ${escapeHtml(activeSprint.goal)}
              </p>

              <div class="radar-pipeline-rows">
                ${state.columns.map(col => {
                  const count = tasks.filter(t => t.columnId === col.id).length;
                  return `
                    <div class="radar-row">
                      <div class="radar-row-left">
                        <span class="column-color-indicator" style="background-color: ${col.color};"></span>
                        <span>${escapeHtml(col.title)}</span>
                      </div>
                      <span class="radar-count">${count}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Recent Activity Stream -->
            <div class="home-side-card">
              <div class="section-card-header">
                <h3 style="font-size: 1rem; font-weight: 700;">📜 Recent Activity</h3>
                <span style="font-size: 0.72rem; color: var(--text-dim);">Live Log</span>
              </div>
              <div class="activity-feed-list">
                <div class="feed-item">
                  <div class="feed-bullet"></div>
                  <div class="feed-content">
                    <strong>TASK-101</strong> updated priority to Urgent
                    <span>Today • In Progress</span>
                  </div>
                </div>
                <div class="feed-item">
                  <div class="feed-bullet" style="background: var(--status-success); box-shadow: 0 0 6px var(--status-success);"></div>
                  <div class="feed-content">
                    <strong>TASK-104</strong> moved to Completed
                    <span>Yesterday • Done</span>
                  </div>
                </div>
                <div class="feed-item">
                  <div class="feed-bullet" style="background: var(--color-accent); box-shadow: 0 0 6px var(--color-accent);"></div>
                  <div class="feed-content">
                    <strong>Sprint 1</strong> milestone initialized
                    <span>3 days ago • Milestone</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pro Shortcuts Card -->
            <div class="home-side-card" style="background: linear-gradient(135deg, var(--bg-surface), var(--bg-surface-elevated));">
              <div class="section-card-header">
                <h3 style="font-size: 0.95rem; font-weight: 700;">⚡ Pro Shortcuts</h3>
                <span>⌨️</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem; color: var(--text-muted);">
                <div style="display: flex; justify-content: space-between;">
                  <span>New Task</span> <kbd style="padding: 1px 6px; background: var(--bg-input); border-radius: 3px;">N</kbd>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Global Search</span> <kbd style="padding: 1px 6px; background: var(--bg-input); border-radius: 3px;">Ctrl+K</kbd>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Kanban Board</span> <kbd style="padding: 1px 6px; background: var(--bg-input); border-radius: 3px;">1</kbd>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Pomodoro Timer</span> <kbd style="padding: 1px 6px; background: var(--bg-input); border-radius: 3px;">3</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderActionTask(task) {
    const priorityObj = Object.values(PRIORITIES).find(p => p.id === task.priority) || PRIORITIES.MEDIUM;
    const colObj = state.columns.find(c => c.id === task.columnId) || { title: task.columnId };
    const subtasks = task.subtasks || [];
    const doneCount = subtasks.filter(s => s.completed).length;

    return `
      <div class="action-task-item" data-id="${task.id}">
        <div class="action-task-left">
          <input type="checkbox" class="task-action-check" data-id="${task.id}" title="Mark completed" style="width: 16px; height: 16px; cursor: pointer; accent-color: var(--status-success);">
          <span class="badge badge-priority-${task.priority}">${priorityObj.icon} ${priorityObj.label}</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${task.id}</span>
          <span class="action-task-title">${escapeHtml(task.title)}</span>
        </div>
        <div class="action-task-right">
          ${subtasks.length > 0 ? `
            <span style="font-size: 0.72rem; color: var(--text-dim);">☑ ${doneCount}/${subtasks.length}</span>
          ` : ''}
          <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: var(--radius-xs); background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-muted);">
            ${escapeHtml(colObj.title)}
          </span>
          ${task.dueDate ? `
            <span style="font-size: 0.75rem; color: var(--text-muted);">📅 ${task.dueDate}</span>
          ` : ''}
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Hero Buttons
    const heroNewTask = document.getElementById('btn-hero-new-task');
    if (heroNewTask) {
      heroNewTask.addEventListener('click', () => taskModal.openNew());
    }

    const heroStartPomo = document.getElementById('btn-hero-start-pomo');
    if (heroStartPomo) {
      heroStartPomo.addEventListener('click', () => {
        if (window.TaskForge) window.TaskForge.switchView(VIEWS.POMODORO);
      });
    }

    const viewAllBoard = document.getElementById('btn-view-all-board');
    if (viewAllBoard) {
      viewAllBoard.addEventListener('click', () => {
        if (window.TaskForge) window.TaskForge.switchView(VIEWS.KANBAN);
      });
    }

    // Launchpad & KPI Card Jump Buttons
    this.container.querySelectorAll('[data-jump]').forEach(el => {
      el.addEventListener('click', () => {
        const targetView = el.dataset.jump;
        if (window.TaskForge && targetView) {
          window.TaskForge.switchView(targetView);
        }
      });
    });

    // Task Row Clicks (Open Modal)
    this.container.querySelectorAll('.action-task-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('task-action-check')) return;
        const taskId = item.dataset.id;
        if (taskId) taskModal.open(taskId);
      });
    });

    // Quick Task Checkbox Completion
    this.container.querySelectorAll('.task-action-check').forEach(cb => {
      cb.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      cb.addEventListener('change', (e) => {
        const taskId = cb.dataset.id;
        if (e.target.checked && taskId) {
          state.moveTask(taskId, 'col-done');
          if (window.TaskForge) window.TaskForge.showToast(`Task ${taskId} completed!`, 'success');
        }
      });
    });
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}
