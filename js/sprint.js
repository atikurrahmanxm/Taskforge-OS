// TaskForge OS - Sprint Planner & Backlog Controller (Milestone 4)
import { state, bus, EVENTS } from './state.js';
import { PRIORITIES, DEFAULT_LABELS } from './config.js';
import { taskModal } from './taskModal.js';

export class SprintPlannerController {
  constructor() {
    this.container = document.getElementById('sprint-container');
    this.init();
  }

  init() {
    bus.subscribe(EVENTS.STATE_INITIALIZED, () => this.render());
    bus.subscribe(EVENTS.TASKS_CHANGED, () => this.render());
    bus.subscribe(EVENTS.SPRINT_CHANGED, () => this.render());

    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const activeSprintId = state.activeSprintId;
    const sprint = state.sprints.find(s => s.id === activeSprintId) || {
      id: 'sprint-1',
      name: 'Sprint 1',
      goal: 'No active sprint set',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    const allTasks = state.tasks;
    const sprintTasks = allTasks.filter(t => t.sprintId === sprint.id);
    const backlogTasks = allTasks.filter(t => t.sprintId !== sprint.id);

    const completedTasks = sprintTasks.filter(t => t.columnId === 'col-done').length;
    const progressPct = sprintTasks.length > 0 ? Math.round((completedTasks / sprintTasks.length) * 100) : 0;
    const totalHours = sprintTasks.reduce((acc, t) => acc + (t.estimateHours || 0), 0);

    this.container.innerHTML = `
      <!-- Active Sprint Hero Card -->
      <div class="sprint-hero-card">
        <div class="sprint-hero-header">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span class="sprint-badge-status">${sprint.status}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">📅 ${sprint.startDate} — ${sprint.endDate}</span>
            </div>
            <h2 class="sprint-title">${escapeHtml(sprint.name)}</h2>
            <p class="sprint-goal-text">🎯 <strong>Goal:</strong> ${escapeHtml(sprint.goal)}</p>
          </div>
          <div>
            <button class="btn btn-primary" id="btn-create-task-sprint">+ Add Task to Sprint</button>
          </div>
        </div>

        <div class="subtasks-progress-wrap" style="margin-top: 16px;">
          <div class="subtasks-count-text">
            <span>Sprint Completion Velocity</span>
            <span><strong>${completedTasks}/${sprintTasks.length} tasks completed</strong> (${progressPct}%)</span>
          </div>
          <div class="progress-track" style="height: 8px;">
            <div class="progress-fill" style="width: ${progressPct}%; background: linear-gradient(90deg, var(--color-primary), var(--status-success));"></div>
          </div>
        </div>

        <div class="sprint-stats-grid">
          <div class="sprint-stat-item">
            <span class="sprint-stat-val">${sprintTasks.length}</span>
            <span class="sprint-stat-lbl">Sprint Tasks</span>
          </div>
          <div class="sprint-stat-item">
            <span class="sprint-stat-val">${completedTasks}</span>
            <span class="sprint-stat-lbl">Completed</span>
          </div>
          <div class="sprint-stat-item">
            <span class="sprint-stat-val">${totalHours}h</span>
            <span class="sprint-stat-lbl">Committed Scope</span>
          </div>
          <div class="sprint-stat-item">
            <span class="sprint-stat-val">${backlogTasks.length}</span>
            <span class="sprint-stat-lbl">Unassigned Backlog</span>
          </div>
        </div>
      </div>

      <!-- Active Sprint Tasks Section -->
      <div class="backlog-section">
        <div class="backlog-header">
          <h3 style="font-size: 1.1rem; font-weight: 700;">Tasks in ${escapeHtml(sprint.name)}</h3>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${sprintTasks.length} items</span>
        </div>
        <div class="backlog-list">
          ${sprintTasks.length === 0 ? `
            <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 0.9rem;">
              No tasks currently in this sprint. Assign tasks from the backlog below!
            </div>
          ` : sprintTasks.map(t => this.renderTaskRow(t, true)).join('')}
        </div>
      </div>

      <!-- Product Backlog Section -->
      <div class="backlog-section">
        <div class="backlog-header">
          <h3 style="font-size: 1.1rem; font-weight: 700;">Unassigned Product Backlog</h3>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${backlogTasks.length} items</span>
        </div>
        <div class="backlog-list">
          ${backlogTasks.length === 0 ? `
            <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 0.9rem;">
              All tasks are assigned to sprints!
            </div>
          ` : backlogTasks.map(t => this.renderTaskRow(t, false)).join('')}
        </div>
      </div>
    `;

    this.bindEvents(sprint.id);
  }

  renderTaskRow(task, inSprint) {
    const priorityObj = Object.values(PRIORITIES).find(p => p.id === task.priority) || PRIORITIES.MEDIUM;
    const colObj = state.columns.find(c => c.id === task.columnId) || { title: task.columnId };

    return `
      <div class="backlog-item" data-task-id="${task.id}">
        <div class="backlog-item-left">
          <span class="badge badge-priority-${task.priority}">${priorityObj.icon} ${priorityObj.label}</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${task.id}</span>
          <span class="backlog-item-title" style="cursor: pointer;">${escapeHtml(task.title)}</span>
        </div>

        <div class="backlog-item-right">
          <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: var(--radius-xs); background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-muted);">
            ${colObj.title}
          </span>
          <span style="font-size: 0.8rem; color: var(--text-dim);">${task.estimateHours || 0}h</span>
          ${inSprint ? `
            <button class="btn btn-outline btn-sm btn-move-backlog" data-id="${task.id}" title="Remove from Sprint">
              ↩ To Backlog
            </button>
          ` : `
            <button class="btn btn-secondary btn-sm btn-move-sprint" data-id="${task.id}" title="Add to Active Sprint">
              + Add to Sprint
            </button>
          `}
        </div>
      </div>
    `;
  }

  bindEvents(activeSprintId) {
    // Add to Sprint Button
    const addSprintTaskBtn = document.getElementById('btn-create-task-sprint');
    if (addSprintTaskBtn) {
      addSprintTaskBtn.addEventListener('click', () => {
        taskModal.openNew('col-backlog');
      });
    }

    // Row clicks to open modal
    this.container.querySelectorAll('.backlog-item-title').forEach(el => {
      el.addEventListener('click', () => {
        const row = el.closest('.backlog-item');
        if (row && row.dataset.taskId) {
          taskModal.open(row.dataset.taskId);
        }
      });
    });

    // Move to Sprint
    this.container.querySelectorAll('.btn-move-sprint').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.dataset.id;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          state.updateTask({ ...task, sprintId: activeSprintId });
          if (window.TaskForge) window.TaskForge.showToast(`Task assigned to ${activeSprintId}`);
        }
      });
    });

    // Move to Backlog
    this.container.querySelectorAll('.btn-move-backlog').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.dataset.id;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          state.updateTask({ ...task, sprintId: null });
          if (window.TaskForge) window.TaskForge.showToast('Task moved back to product backlog');
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
