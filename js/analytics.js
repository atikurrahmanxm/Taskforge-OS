// TaskForge OS - Productivity Analytics & Velocity Visualizer (Milestone 5)
import { state, bus, EVENTS } from './state.js';
import { PRIORITIES } from './config.js';
import { storage } from './storage.js';

export class AnalyticsController {
  constructor() {
    this.container = document.getElementById('analytics-container');
    this.init();
  }

  init() {
    bus.subscribe(EVENTS.STATE_INITIALIZED, () => this.render());
    bus.subscribe(EVENTS.TASKS_CHANGED, () => this.render());

    this.render();
  }

  render() {
    if (!this.container) return;

    const tasks = state.tasks;
    const total = tasks.length;
    const completed = tasks.filter(t => t.columnId === 'col-done').length;
    const inProgress = tasks.filter(t => t.columnId === 'col-in-progress').length;
    const inReview = tasks.filter(t => t.columnId === 'col-review').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalHours = tasks.reduce((acc, t) => acc + (t.estimateHours || 0), 0);
    const completedHours = tasks.filter(t => t.columnId === 'col-done').reduce((acc, t) => acc + (t.estimateHours || 0), 0);

    const pomoHistory = storage.getPomodoroHistory();
    const pomoMinutes = pomoHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
    const pomoHours = (pomoMinutes / 60).toFixed(1);

    // Priority breakdown
    const priorityCounts = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    this.container.innerHTML = `
      <!-- Top 4 Metric Cards -->
      <div class="analytics-stats-grid">
        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Completion Rate</span>
            <span>🎯</span>
          </div>
          <div class="stat-card-val">${completionRate}%</div>
          <div class="stat-card-sub">${completed} of ${total} tasks closed</div>
        </div>

        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Work In Progress (WIP)</span>
            <span>⚡</span>
          </div>
          <div class="stat-card-val">${inProgress + inReview}</div>
          <div class="stat-card-sub">${inProgress} active, ${inReview} in review</div>
        </div>

        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Committed Scope</span>
            <span>⏱️</span>
          </div>
          <div class="stat-card-val">${totalHours}h</div>
          <div class="stat-card-sub">${completedHours}h completed so far</div>
        </div>

        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Focus Deep Work</span>
            <span>🔥</span>
          </div>
          <div class="stat-card-val">${pomoHours}h</div>
          <div class="stat-card-sub">${pomoHistory.length} Pomodoro sessions logged</div>
        </div>
      </div>

      <!-- Charts & Visualizers Grid -->
      <div class="analytics-charts-grid">
        <!-- Priority Distribution Chart -->
        <div class="analytics-chart-card">
          <div class="chart-card-header">
            <h3 class="chart-card-title">Priority Breakdown</h3>
            <span style="font-size: 0.8rem; color: var(--text-dim);">${total} tasks</span>
          </div>
          <div class="priority-dist-bars">
            ${Object.values(PRIORITIES).map(p => {
              const count = priorityCounts[p.id] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return `
                <div class="dist-item">
                  <div class="dist-item-top">
                    <span>${p.icon} ${p.label}</span>
                    <span>${count} (${pct}%)</span>
                  </div>
                  <div class="dist-bar-track">
                    <div class="dist-bar-fill" style="width: ${pct}%; background-color: ${p.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Lifecycle Column Distribution -->
        <div class="analytics-chart-card">
          <div class="chart-card-header">
            <h3 class="chart-card-title">Lifecycle Column Velocity</h3>
            <span style="font-size: 0.8rem; color: var(--text-dim);">Pipeline</span>
          </div>
          <div class="columns-dist-bars">
            ${state.columns.map(col => {
              const count = tasks.filter(t => t.columnId === col.id).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return `
                <div class="dist-item">
                  <div class="dist-item-top">
                    <span>● ${col.title}</span>
                    <span>${count} tasks (${pct}%)</span>
                  </div>
                  <div class="dist-bar-track">
                    <div class="dist-bar-fill" style="width: ${pct}%; background-color: ${col.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }
}
