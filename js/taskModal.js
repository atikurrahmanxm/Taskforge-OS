// TaskForge OS - Task Create / Edit Dialog Controller (Milestone 3)
import { state } from './state.js';
import { PRIORITIES, DEFAULT_LABELS } from './config.js';

class TaskModalController {
  constructor() {
    this.dialog = document.getElementById('task-modal');
    this.form = document.getElementById('task-form');
    this.modalBody = document.getElementById('task-modal-body');
    this.modalTitle = document.getElementById('taskModalTitle');
    this.closeBtn = document.getElementById('btn-close-task-modal');
    this.cancelBtn = document.getElementById('btn-cancel-task');

    this.currentEditingTaskId = null;
    this.currentSubtasks = [];

    this.init();
  }

  init() {
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.close());

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSave();
      });
    }
  }

  openNew(columnId = 'col-backlog') {
    this.currentEditingTaskId = null;
    this.currentSubtasks = [];
    this.modalTitle.textContent = 'Create New Task';
    this.renderFormFields({
      title: '',
      description: '',
      columnId,
      priority: PRIORITIES.MEDIUM.id,
      estimateHours: 4,
      dueDate: '',
      labels: ['lbl-feat'],
      subtasks: [],
    });
    this.dialog.showModal();
  }

  open(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    this.currentEditingTaskId = taskId;
    this.currentSubtasks = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
    this.modalTitle.textContent = `Edit Task ${task.id}`;
    this.renderFormFields(task);
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }

  renderFormFields(task) {
    const columns = state.columns;
    const isEdit = !!this.currentEditingTaskId;

    this.modalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="task-input-title">Task Title *</label>
        <input type="text" id="task-input-title" class="form-control" value="${escapeHtml(task.title)}" placeholder="e.g. Implement OAuth Flow" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="task-input-desc">Description</label>
        <textarea id="task-input-desc" class="form-control" rows="3" placeholder="Provide background, ACs, or implementation details...">${escapeHtml(task.description || '')}</textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="form-group">
          <label class="form-label" for="task-input-column">Column Lifecycle</label>
          <select id="task-input-column" class="form-control">
            ${columns.map(c => `<option value="${c.id}" ${c.id === task.columnId ? 'selected' : ''}>${c.title}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="task-input-priority">Priority</label>
          <select id="task-input-priority" class="form-control">
            ${Object.values(PRIORITIES).map(p => `
              <option value="${p.id}" ${p.id === task.priority ? 'selected' : ''}>${p.icon} ${p.label}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="form-group">
          <label class="form-label" for="task-input-estimate">Estimate (Hours)</label>
          <input type="number" id="task-input-estimate" class="form-control" min="0" step="0.5" value="${task.estimateHours || 2}">
        </div>

        <div class="form-group">
          <label class="form-label" for="task-input-due">Due Date</label>
          <input type="date" id="task-input-due" class="form-control" value="${task.dueDate || ''}">
        </div>
      </div>

      <!-- Subtasks Checklist Section -->
      <div class="form-group">
        <label class="form-label">Subtasks & Acceptance Criteria</label>
        <div id="subtasks-container" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">
          <!-- Dynamically filled -->
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="new-subtask-input" class="form-control" placeholder="Add subtask...">
          <button type="button" class="btn btn-secondary" id="btn-add-subtask">+ Add</button>
        </div>
      </div>

      <!-- Labels Chips -->
      <div class="form-group">
        <label class="form-label">Labels & Tags</label>
        <div id="labels-selector" style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${DEFAULT_LABELS.map(lbl => {
            const checked = (task.labels || []).includes(lbl.id);
            return `
              <label style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: var(--radius-full); background: var(--bg-surface-elevated); border: 1px solid var(--border-default); cursor: pointer; font-size: 0.8rem;">
                <input type="checkbox" name="task-label-chip" value="${lbl.id}" ${checked ? 'checked' : ''}>
                <span style="color: ${lbl.color}; font-weight: 600;">●</span>
                <span>${lbl.name}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>

      ${isEdit ? `
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-outline" id="btn-delete-task" style="color: var(--priority-urgent); border-color: var(--priority-urgent);">🗑️ Delete Task</button>
        </div>
      ` : ''}
    `;

    this.renderSubtaskList();
    this.bindSubtaskEvents();

    if (isEdit) {
      const delBtn = document.getElementById('btn-delete-task');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (confirm(`Are you sure you want to delete ${this.currentEditingTaskId}?`)) {
            state.deleteTask(this.currentEditingTaskId);
            this.close();
            if (window.TaskForge) window.TaskForge.showToast('Task deleted', 'error');
          }
        });
      }
    }
  }

  renderSubtaskList() {
    const container = document.getElementById('subtasks-container');
    if (!container) return;

    if (this.currentSubtasks.length === 0) {
      container.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-dim);">No subtasks yet.</span>`;
      return;
    }

    container.innerHTML = this.currentSubtasks.map((st, i) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); font-size: 0.85rem;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; flex: 1;">
          <input type="checkbox" data-index="${i}" class="subtask-checkbox" ${st.completed ? 'checked' : ''}>
          <span style="${st.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${escapeHtml(st.title)}</span>
        </label>
        <button type="button" data-index="${i}" class="btn-del-subtask" style="color: var(--text-dim); padding: 2px 6px;">✖</button>
      </div>
    `).join('');

    container.querySelectorAll('.subtask-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.currentSubtasks[idx].completed = e.target.checked;
        this.renderSubtaskList();
      });
    });

    container.querySelectorAll('.btn-del-subtask').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.currentSubtasks.splice(idx, 1);
        this.renderSubtaskList();
      });
    });
  }

  bindSubtaskEvents() {
    const addBtn = document.getElementById('btn-add-subtask');
    const input = document.getElementById('new-subtask-input');

    const handleAdd = () => {
      const val = input.value.trim();
      if (!val) return;
      this.currentSubtasks.push({
        id: `sub-${Date.now()}`,
        title: val,
        completed: false,
      });
      input.value = '';
      this.renderSubtaskList();
    };

    if (addBtn && input) {
      addBtn.addEventListener('click', handleAdd);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAdd();
        }
      });
    }
  }

  handleSave() {
    const title = document.getElementById('task-input-title').value.trim();
    if (!title) return;

    const description = document.getElementById('task-input-desc').value.trim();
    const columnId = document.getElementById('task-input-column').value;
    const priority = document.getElementById('task-input-priority').value;
    const estimateHours = parseFloat(document.getElementById('task-input-estimate').value) || 0;
    const dueDate = document.getElementById('task-input-due').value;

    const labelBoxes = document.querySelectorAll('input[name="task-label-chip"]:checked');
    const labels = Array.from(labelBoxes).map(b => b.value);

    const taskPayload = {
      title,
      description,
      columnId,
      priority,
      estimateHours,
      dueDate,
      labels,
      subtasks: this.currentSubtasks,
    };

    if (this.currentEditingTaskId) {
      const existing = state.tasks.find(t => t.id === this.currentEditingTaskId);
      state.updateTask({ ...existing, ...taskPayload });
      if (window.TaskForge) window.TaskForge.showToast('Task updated successfully!', 'success');
    } else {
      state.createTask(taskPayload);
      if (window.TaskForge) window.TaskForge.showToast('New task created!', 'success');
    }

    this.close();
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

export const taskModal = new TaskModalController();
