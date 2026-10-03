// TaskForge OS - App Bootstrapper & View Router (Milestone 2)
import { APP_CONFIG, VIEWS } from './config.js';
import { state, bus, EVENTS } from './state.js';

class TaskForgeApp {
  constructor() {
    this.currentView = VIEWS.KANBAN;
    this.theme = localStorage.getItem('taskforge_theme') || APP_CONFIG.DEFAULT_THEME;
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.bindNavigation();
    this.bindThemeToggle();
    this.bindShortcutsModal();
    this.bindDialogFallbacks();
    this.bindGlobalShortcuts();
    this.bindStateListeners();
    this.updateCounters();

    console.log(`[TaskForge OS] Bootstrapped v${APP_CONFIG.VERSION}`);
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
      } else if (e.key === '1') {
        this.switchView(VIEWS.KANBAN);
      } else if (e.key === '2') {
        this.switchView(VIEWS.SPRINT);
      } else if (e.key === '3') {
        this.switchView(VIEWS.POMODORO);
      } else if (e.key === '4') {
        this.switchView(VIEWS.ANALYTICS);
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
