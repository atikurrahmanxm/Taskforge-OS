// TaskForge OS - Interactive Kanban Board & Drag-and-Drop Engine (Milestone 3)
import { state, bus, EVENTS } from './state.js';
import { PRIORITIES, DEFAULT_LABELS } from './config.js';
import { taskModal } from './taskModal.js';

export class KanbanBoardController {
  constructor() {
    this.container = document.getElementById('kanban-board');
    this.draggedTaskId = null;
    this.init();
  }

  init() {
    bus.subscribe(EVENTS.STATE_INITIALIZED, () => this.render());
    bus.subscribe(EVENTS.TASKS_CHANGED, () => this.render());
    bus.subscribe(EVENTS.FILTER_CHANGED, () => this.render());
    bus.subscribe(EVENTS.SEARCH_CHANGED, () => this.render());

    this.renderFilters();
    this.render();
  }

  renderFilters() {
    const filterContainer = document.getElementById('kanban-filters');
    if (!filterContainer) return;

    filterContainer.innerHTML = `
      <div class="filter-bar">
        <select id="filter-select-priority" class="filter-select">
          <option value="all">All Priorities</option>
          ${Object.values(PRIORITIES).map(p => `
            <option value="${p.id}" ${state.filters.priority === p.id ? 'selected' : ''}>${p.icon} ${p.label}</option>
          `).join('')}
        </select>

        <select id="filter-select-label" class="filter-select">
          <option value="all">All Labels</option>
          ${DEFAULT_LABELS.map(l => `
            <option value="${l.id}" ${state.filters.label === l.id ? 'selected' : ''}>● ${l.name}</option>
          `).join('')}
        </select>

        ${(state.filters.priority !== 'all' || state.filters.label !== 'all' || state.searchQuery) ? `
          <button id="btn-clear-filters" class="btn btn-outline btn-sm" style="font-size: 0.75rem;">Clear Filters ✖</button>
        ` : ''}
      </div>
    `;

    // Bind change listeners
    const prioritySelect = document.getElementById('filter-select-priority');
    if (prioritySelect) {
      prioritySelect.addEventListener('change', (e) => {
        state.setFilter('priority', e.target.value);
        this.renderFilters();
      });
    }

    const labelSelect = document.getElementById('filter-select-label');
    if (labelSelect) {
      labelSelect.addEventListener('change', (e) => {
        state.setFilter('label', e.target.value);
        this.renderFilters();
      });
    }

    const clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.setFilter('priority', 'all');
        state.setFilter('label', 'all');
        state.setSearchQuery('');
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = '';
        this.renderFilters();
      });
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const columns = state.columns;

    columns.forEach(col => {
      const tasks = state.getTasksByColumn(col.id);
      const isOverLimit = col.limit && tasks.length > col.limit;

      const colEl = document.createElement('div');
      colEl.className = 'kanban-column';
      colEl.dataset.columnId = col.id;

      colEl.innerHTML = `
        <div class="column-header">
          <div class="column-title-group">
            <span class="column-color-indicator" style="background-color: ${col.color};"></span>
            <span class="column-title">${escapeHtml(col.title)}</span>
            <span class="column-count-badge ${isOverLimit ? 'badge-priority-urgent' : ''}">
              ${tasks.length}${col.limit ? ` / ${col.limit}` : ''}
            </span>
          </div>
          <div class="column-actions">
            <button class="btn-add-card-inline" data-column="${col.id}" title="Add Task in ${col.title}">+</button>
          </div>
        </div>
        <div class="kanban-cards-list" data-column-id="${col.id}">
          <!-- Cards -->
        </div>
      `;

      const cardsList = colEl.querySelector('.kanban-cards-list');
      tasks.forEach(task => {
        const cardEl = this.createCardElement(task);
        cardsList.appendChild(cardEl);
      });

      this.bindDropZone(cardsList, col.id);
      this.container.appendChild(colEl);
    });

    // Bind inline add card buttons
    this.container.querySelectorAll('.btn-add-card-inline').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const colId = btn.dataset.column;
        taskModal.openNew(colId);
      });
    });
  }

  createCardElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.taskId = task.id;

    // Subtask calculation
    const subtasks = task.subtasks || [];
    const doneCount = subtasks.filter(s => s.completed).length;
    const pct = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0;

    // Priority badge
    const priorityObj = Object.values(PRIORITIES).find(p => p.id === task.priority) || PRIORITIES.MEDIUM;

    // Due date
    let dueHtml = '';
    if (task.dueDate) {
      const isOverdue = new Date(task.dueDate) < new Date() && task.columnId !== 'col-done';
      dueHtml = `
        <span class="card-due-date ${isOverdue ? 'overdue' : ''}">
          📅 ${task.dueDate}
        </span>
      `;
    }

    // Label chips
    const labelsHtml = (task.labels || []).map(lid => {
      const def = DEFAULT_LABELS.find(l => l.id === lid);
      return def ? `<span class="card-label-chip" style="background-color: ${def.color};">${def.name}</span>` : '';
    }).join('');

    card.innerHTML = `
      <div class="card-top">
        <span class="card-id">${task.id}</span>
        <span class="badge badge-priority-${task.priority}">
          ${priorityObj.icon} ${priorityObj.label}
        </span>
      </div>

      <h3 class="card-title">${escapeHtml(task.title)}</h3>
      ${task.description ? `<p class="card-desc-snippet">${escapeHtml(task.description)}</p>` : ''}

      ${subtasks.length > 0 ? `
        <div class="subtasks-progress-wrap">
          <div class="subtasks-count-text">
            <span>Checklist</span>
            <span>${doneCount}/${subtasks.length}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      ` : ''}

      <div class="card-bottom">
        <div class="card-labels">${labelsHtml}</div>
        <div>${dueHtml}</div>
      </div>
    `;

    // Click to edit
    card.addEventListener('click', () => {
      taskModal.open(task.id);
    });

    // Drag events
    card.addEventListener('dragstart', (e) => {
      this.draggedTaskId = task.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
    });

    card.addEventListener('dragend', () => {
      this.draggedTaskId = null;
      card.classList.remove('dragging');
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
    });

    return card;
  }

  bindDropZone(cardsList, columnId) {
    cardsList.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const colEl = cardsList.closest('.kanban-column');
      if (colEl) colEl.classList.add('drag-over');
    });

    cardsList.addEventListener('dragleave', (e) => {
      if (!cardsList.contains(e.relatedTarget)) {
        const colEl = cardsList.closest('.kanban-column');
        if (colEl) colEl.classList.remove('drag-over');
      }
    });

    cardsList.addEventListener('drop', (e) => {
      e.preventDefault();
      const colEl = cardsList.closest('.kanban-column');
      if (colEl) colEl.classList.remove('drag-over');

      const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;
      if (!taskId) return;

      // Calculate drop index based on mouse position
      const cards = Array.from(cardsList.querySelectorAll('.task-card:not(.dragging)'));
      let targetIndex = null;

      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          targetIndex = i;
          break;
        }
      }

      state.moveTask(taskId, columnId, targetIndex);
      if (window.TaskForge) {
        window.TaskForge.showToast(`Task moved to ${columnId.replace('col-', '').replace('-', ' ')}`);
      }
    });
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}
