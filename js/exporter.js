// TaskForge OS - Backup, JSON Restore & CSV Exporter (Milestone 6)
import { state, bus, EVENTS } from './state.js';
import { storage } from './storage.js';
import { FONTS_CONFIG } from './config.js';

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

    const currentSettings = storage.getSettings() || {};
    const currentSans = currentSettings.fontSans || 'geist';
    const currentMono = currentSettings.fontMono || 'geist';
    const currentDensity = currentSettings.fontSize || 'comfortable';

    this.container.innerHTML = `
      <div style="max-width: 820px; display: flex; flex-direction: column; gap: 24px;">
        <!-- Typography & Font System Studio Card -->
        <div class="card" id="settings-typography-card" style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.02em;">🔤 Typography & Font System Studio</h2>
              <p style="font-size: 0.88rem; color: var(--text-muted);">
                Select from the world's most widely used developer & UI fonts. All settings are saved locally and applied live across your workstation.
              </p>
            </div>
            <span class="badge" style="background: var(--color-primary-light); color: var(--color-primary); border: 1px solid var(--color-primary);">Live Preview</span>
          </div>

          <!-- 1. Primary UI Font (Sans-Serif) -->
          <div style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim);">
                Primary UI Font (Sans-Serif)
              </label>
              <span style="font-size: 0.75rem; color: var(--text-dim);">Widely Used in Modern Tech</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;" id="font-sans-options">
              ${FONTS_CONFIG.SANS_OPTIONS.map(opt => `
                <div class="font-option-card ${currentSans === opt.id ? 'active' : ''}" data-font-sans="${opt.id}">
                  <div class="font-option-card-header">
                    <span class="font-option-title">${opt.name}</span>
                    ${currentSans === opt.id ? '<span class="font-option-badge">Active</span>' : ''}
                  </div>
                  <span class="font-option-desc">${opt.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 2. Code & Monospace Font -->
          <div style="margin-top: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim);">
                Code & Monospace Font (Task IDs, Metrics & Code)
              </label>
              <span style="font-size: 0.75rem; color: var(--text-dim);">Engineering Favorites</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;" id="font-mono-options">
              ${FONTS_CONFIG.MONO_OPTIONS.map(opt => `
                <div class="font-option-card ${currentMono === opt.id ? 'active' : ''}" data-font-mono="${opt.id}">
                  <div class="font-option-card-header">
                    <span class="font-option-title" style="font-family: var(--font-mono);">${opt.name}</span>
                    ${currentMono === opt.id ? '<span class="font-option-badge">Active</span>' : ''}
                  </div>
                  <span class="font-option-desc">${opt.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3. Typography Density Scale -->
          <div style="margin-top: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim);">
                Typography Scale & Density
              </label>
              <span style="font-size: 0.75rem; color: var(--text-dim);">Linear & Raycast View Styles</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;" id="font-density-options">
              ${FONTS_CONFIG.DENSITY_OPTIONS.map(opt => `
                <div class="font-option-card ${currentDensity === opt.id ? 'active' : ''}" data-font-density="${opt.id}">
                  <div class="font-option-card-header">
                    <span class="font-option-title">${opt.name}</span>
                    ${currentDensity === opt.id ? '<span class="font-option-badge">Active</span>' : ''}
                  </div>
                  <span class="font-option-desc">${opt.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Real-time Typography Preview Box -->
          <div style="margin-top: 24px; padding: 18px 20px; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.06em; color: var(--text-dim); margin-bottom: 8px;">
              Real-Time Typography Preview
            </div>
            <div id="live-preview-sans" style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; letter-spacing: -0.015em;">
              The quick brown fox jumps over the lazy dog. 0123456789
            </div>
            <div id="live-preview-mono" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-primary); background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-xs); border: 1px solid var(--border-default);">
              const sprint = { id: "SPR-01", velocity: "94%", status: "shipped", focus: "25m" };
            </div>
          </div>
        </div>

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
    // Typography Font Sans Switcher
    this.container.querySelectorAll('[data-font-sans]').forEach(card => {
      card.addEventListener('click', () => {
        const fontId = card.dataset.fontSans;
        document.documentElement.setAttribute('data-font', fontId);
        
        const settings = storage.getSettings() || {};
        settings.fontSans = fontId;
        storage.saveSettings(settings);

        this.container.querySelectorAll('[data-font-sans]').forEach(c => {
          c.classList.remove('active');
          const badge = c.querySelector('.font-option-badge');
          if (badge) badge.remove();
        });
        card.classList.add('active');
        const header = card.querySelector('.font-option-card-header');
        if (header && !header.querySelector('.font-option-badge')) {
          header.insertAdjacentHTML('beforeend', '<span class="font-option-badge">Active</span>');
        }

        const opt = FONTS_CONFIG.SANS_OPTIONS.find(o => o.id === fontId);
        if (window.TaskForge) {
          window.TaskForge.showToast(`Typography updated to ${opt ? opt.name : fontId}`, 'success');
        }
      });
    });

    // Typography Font Mono Switcher
    this.container.querySelectorAll('[data-font-mono]').forEach(card => {
      card.addEventListener('click', () => {
        const monoId = card.dataset.fontMono;
        document.documentElement.setAttribute('data-mono', monoId);

        const settings = storage.getSettings() || {};
        settings.fontMono = monoId;
        storage.saveSettings(settings);

        this.container.querySelectorAll('[data-font-mono]').forEach(c => {
          c.classList.remove('active');
          const badge = c.querySelector('.font-option-badge');
          if (badge) badge.remove();
        });
        card.classList.add('active');
        const header = card.querySelector('.font-option-card-header');
        if (header && !header.querySelector('.font-option-badge')) {
          header.insertAdjacentHTML('beforeend', '<span class="font-option-badge">Active</span>');
        }

        const opt = FONTS_CONFIG.MONO_OPTIONS.find(o => o.id === monoId);
        if (window.TaskForge) {
          window.TaskForge.showToast(`Code font updated to ${opt ? opt.name : monoId}`, 'success');
        }
      });
    });

    // Typography Density Switcher
    this.container.querySelectorAll('[data-font-density]').forEach(card => {
      card.addEventListener('click', () => {
        const densityId = card.dataset.fontDensity;
        document.documentElement.setAttribute('data-font-size', densityId);

        const settings = storage.getSettings() || {};
        settings.fontSize = densityId;
        storage.saveSettings(settings);

        this.container.querySelectorAll('[data-font-density]').forEach(c => {
          c.classList.remove('active');
          const badge = c.querySelector('.font-option-badge');
          if (badge) badge.remove();
        });
        card.classList.add('active');
        const header = card.querySelector('.font-option-card-header');
        if (header && !header.querySelector('.font-option-badge')) {
          header.insertAdjacentHTML('beforeend', '<span class="font-option-badge">Active</span>');
        }

        const opt = FONTS_CONFIG.DENSITY_OPTIONS.find(o => o.id === densityId);
        if (window.TaskForge) {
          window.TaskForge.showToast(`Typography density set to ${opt ? opt.name : densityId}`, 'success');
        }
      });
    });

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
