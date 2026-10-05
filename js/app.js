// TaskForge OS - App Bootstrapper & View Router
import { APP_CONFIG, VIEWS } from './config.js';
import { state, bus, EVENTS } from './state.js';
import { storage } from './storage.js';
import { taskModal } from './taskModal.js';
import { HomeController } from './home.js';
import { KanbanBoardController } from './kanban.js';
import { SprintPlannerController } from './sprint.js';
import { PomodoroController } from './pomodoro.js';
import { AnalyticsController } from './analytics.js';
import { DataExporterController } from './exporter.js';

class TaskForgeApp {
  constructor() {
    this.currentView = VIEWS.HOME;
    this.theme = localStorage.getItem('taskforge_theme') || APP_CONFIG.DEFAULT_THEME;
    this.home = null;
    this.kanbanBoard = null;
    this.sprintPlanner = null;
    this.pomodoro = null;
    this.analytics = null;
    this.exporter = null;
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.applyFontSettings();
    this.bindNavigation();
    this.bindThemeToggle();
    this.bindFontSettingsButton();
    this.bindShortcutsModal();
    this.bindDialogFallbacks();
    this.bindGlobalShortcuts();
    this.bindQuickAdd();
    this.bindSearchInput();
    this.bindStateListeners();
    this.updateCounters();

    // Initialize View Controllers
    this.home = new HomeController();
    this.kanbanBoard = new KanbanBoardController();
    this.sprintPlanner = new SprintPlannerController();
    this.pomodoro = new PomodoroController();
    this.analytics = new AnalyticsController();
    this.exporter = new DataExporterController();

    console.log(`[TaskForge OS] Bootstrapped v${APP_CONFIG.VERSION}`);
  }

  bindSearchInput() {
    const input = document.getElementById('global-search-input');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.setSearchQuery(e.target.value);
      }, 200);
    });
  }

  bindQuickAdd() {
    const quickAddBtn = document.getElementById('btn-quick-add-task');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        taskModal.openNew();
      });
    }
  }

  bindStateListeners() {
    bus.subscribe(EVENTS.TASKS_CHANGED, () => this.updateCounters());
    bus.subscribe(EVENTS.STATE_INITIALIZED, () => this.updateCounters());
  }

  updateCounters() {
    const kanbanCount = document.getElementById('nav-count-kanban');
    if (kanbanCount) {
      kanbanCount.textContent = state.tasks.length;
    }
  }

  // Theme Management
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskforge_theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    this.showToast(`Switched to ${nextTheme} theme`);
  }

  bindThemeToggle() {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', () => this.toggleTheme());
    }
  }

  // Typography & Font System
  applyFontSettings() {
    const settings = storage.getSettings() || {};
    const fontSans = settings.fontSans || 'geist';
    const fontMono = settings.fontMono || 'geist';
    const fontSize = settings.fontSize || 'comfortable';

    document.documentElement.setAttribute('data-font', fontSans);
    document.documentElement.setAttribute('data-mono', fontMono);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }

  bindFontSettingsButton() {
    const btn = document.getElementById('font-settings-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        this.switchView(VIEWS.SETTINGS);
        const card = document.getElementById('settings-typography-card');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth' });
          card.style.borderColor = 'var(--color-primary)';
          setTimeout(() => {
            card.style.borderColor = 'var(--border-default)';
          }, 1500);
        }
      });
    }
  }

  // View Navigation
  switchView(viewName) {
    if (!Object.values(VIEWS).includes(viewName)) return;
    this.currentView = viewName;

    // Update active nav button
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Update view section visibility
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${viewName}`);
    });

    // Update breadcrumbs
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) {
      const titles = {
        [VIEWS.HOME]: 'Workspace Overview',
        [VIEWS.KANBAN]: 'Kanban Board',
        [VIEWS.SPRINT]: 'Sprint Planner',
        [VIEWS.POMODORO]: 'Pomodoro Timer',
        [VIEWS.ANALYTICS]: 'Analytics & Velocity',
        [VIEWS.SETTINGS]: 'Settings & Backup',
      };
      viewTitle.textContent = titles[viewName] || viewName;
    }
  }

  bindNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.view;
        if (view) this.switchView(view);
      });
    });
  }

  // Dialog Light-Dismiss Fallbacks (per modern-web-guidance)
  bindDialogFallbacks() {
    document.querySelectorAll('dialog.modal-dialog').forEach(dialog => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialog.addEventListener('click', (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isDialogContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (!isDialogContent) dialog.close();
        });
      }
    });
  }

  // Shortcuts Modal
  bindShortcutsModal() {
    const shortcutsBtn = document.getElementById('shortcuts-btn');
    const shortcutsModal = document.getElementById('shortcuts-modal');
    const closeBtn = document.getElementById('btn-close-shortcuts-modal');

    if (shortcutsBtn && shortcutsModal) {
      shortcutsBtn.addEventListener('click', () => shortcutsModal.showModal());
    }
    if (closeBtn && shortcutsModal) {
      closeBtn.addEventListener('click', () => shortcutsModal.close());
    }
  }

  // Global Shortcuts
  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key === 'Escape') e.target.blur();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      } else if (e.key === '?') {
        e.preventDefault();
        const modal = document.getElementById('shortcuts-modal');
        if (modal) modal.showModal();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        taskModal.openNew();
      } else if (e.key === '0' || e.key.toLowerCase() === 'h') {
        this.switchView(VIEWS.HOME);
      } else if (e.key === '1') {
        this.switchView(VIEWS.KANBAN);
      } else if (e.key === '2') {
        this.switchView(VIEWS.SPRINT);
      } else if (e.key === '3') {
        this.switchView(VIEWS.POMODORO);
      } else if (e.key === '4') {
        this.switchView(VIEWS.ANALYTICS);
      } else if (e.key === '5' || e.key.toLowerCase() === 't') {
        this.switchView(VIEWS.SETTINGS);
        const card = document.getElementById('settings-typography-card');
        if (card) card.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Toast System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.TaskForge = new TaskForgeApp();
});
