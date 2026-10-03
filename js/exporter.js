// TaskForge OS - Backup, JSON Restore & CSV Exporter (Milestone 6)
import { state, bus, EVENTS } from './state.js';
import { storage } from './storage.js';

export class DataExporterController {
  constructor() {
    this.container = document.getElementById('settings-container');
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="max-width: 800px; display: flex; flex-direction: column; gap: 24px;">
        <!-- Data Portability Card -->
        <div class="card" style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 24px;">
          <h2 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">💾 Backup & Data Portability</h2>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            Export your entire workstation state into JSON or CSV format, or restore from a previously saved backup file.
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-export-json">
              📥 Download JSON Backup
            </button>
            <button class="btn btn-secondary" id="btn-export-csv">
              📊 Export Tasks to CSV
            </button>
            <label class="btn btn-outline" style="cursor: pointer;">
              📤 Restore from JSON
              <input type="file" id="input-restore-file" accept=".json" style="display: none;">
            </label>
          </div>
        </div>

        <!-- Preferences Card -->
        <div class="card" style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 24px;">
          <h2 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">⚙️ Workspace Preferences</h2>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <strong style="font-size: 0.95rem; display: block;">Theme Preference</strong>
                <span style="font-size: 0.82rem; color: var(--text-muted);">Toggle between sleek Dark and crisp Light workstation modes.</span>
              </div>
              <button class="btn btn-secondary" id="btn-settings-theme">Switch Theme</button>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <strong style="font-size: 0.95rem; display: block; color: var(--priority-urgent);">Reset to Demo Workspace</strong>
                <span style="font-size: 0.82rem; color: var(--text-muted);">Wipes current changes and re-seeds original sample development sprint.</span>
              </div>
              <button class="btn btn-outline" id="btn-reset-demo" style="color: var(--priority-urgent); border-color: var(--priority-urgent);">
                ⚠️ Reset All Data
              </button>
            </div>
          </div>
        </div>

        <!-- Workspace Info Card -->
        <div style="padding: 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); font-size: 0.82rem; color: var(--text-muted);">
          TaskForge OS v1.0.0 • Pure Vanilla Web Technology • Local-First Architecture • Zero telemetry.
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Export JSON
    const exportJsonBtn = document.getElementById('btn-export-json');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => this.exportJSON());
    }

    // Export CSV
    const exportCsvBtn = document.getElementById('btn-export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this.exportCSV());
    }

    // Restore JSON
    const restoreInput = document.getElementById('input-restore-file');
    if (restoreInput) {
      restoreInput.addEventListener('change', (e) => this.restoreJSON(e));
    }

    // Theme Switch
    const themeBtn = document.getElementById('btn-settings-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        if (window.TaskForge) window.TaskForge.toggleTheme();
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById('btn-reset-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all tasks to demo data? Current local data will be replaced.')) {
          localStorage.clear();
          storage.seedIfEmpty();
          state.init();
          if (window.TaskForge) {
            window.TaskForge.showToast('Workspace reset to demo data!', 'success');
          }
          this.render();
        }
      });
    }
  }

  exportJSON() {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks: state.tasks,
      columns: state.columns,
      sprints: state.sprints,
      activeSprintId: state.activeSprintId,
      settings: storage.getSettings(),
      pomodoroHistory: storage.getPomodoroHistory(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskforge_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    if (window.TaskForge) window.TaskForge.showToast('JSON backup exported successfully!', 'success');
  }

  exportCSV() {
    const tasks = state.tasks;
    if (tasks.length === 0) {
      if (window.TaskForge) window.TaskForge.showToast('No tasks to export', 'error');
      return;
    }

    const headers = ['ID', 'Title', 'Description', 'Column', 'Priority', 'Estimate (Hours)', 'Due Date', 'Created At'];
    const rows = tasks.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.columnId,
      t.priority,
      t.estimateHours || 0,
      t.dueDate || '',
      t.createdAt || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskforge_tasks_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    if (window.TaskForge) window.TaskForge.showToast('CSV spreadsheet exported successfully!', 'success');
  }

  restoreJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.tasks || !Array.isArray(data.tasks)) {
          throw new Error('Invalid TaskForge backup format');
        }

        storage.saveTasks(data.tasks);
        if (data.columns) storage.saveColumns(data.columns);
        if (data.sprints) storage.saveSprints(data.sprints);
        if (data.activeSprintId) storage.setActiveSprintId(data.activeSprintId);
        if (data.settings) storage.saveSettings(data.settings);

        state.init();

        if (window.TaskForge) {
          window.TaskForge.showToast('Workspace successfully restored!', 'success');
        }
        this.render();
      } catch (err) {
        alert('Could not restore backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  }
}
