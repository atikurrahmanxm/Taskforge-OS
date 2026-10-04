(() => {
  // js/config.js
  var APP_CONFIG = {
    APP_NAME: "TaskForge OS",
    VERSION: "1.0.0",
    STORAGE_PREFIX: "taskforge_",
    DEFAULT_BOARD_ID: "board-main",
    DEFAULT_THEME: "dark"
  };
  var PRIORITIES = {
    URGENT: { id: "urgent", label: "Urgent", color: "#ef4444", icon: "\u{1F525}" },
    HIGH: { id: "high", label: "High", color: "#f97316", icon: "\u26A1" },
    MEDIUM: { id: "medium", label: "Medium", color: "#eab308", icon: "\u{1F7E1}" },
    LOW: { id: "low", label: "Low", color: "#10b981", icon: "\u{1F7E2}" }
  };
  var DEFAULT_COLUMNS = [
    { id: "col-backlog", title: "Backlog", color: "#64748b", limit: null },
    { id: "col-in-progress", title: "In Progress", color: "#38bdf8", limit: 4 },
    { id: "col-review", title: "Code Review", color: "#a855f7", limit: 3 },
    { id: "col-done", title: "Completed", color: "#10b981", limit: null }
  ];
  var DEFAULT_LABELS = [
    { id: "lbl-feat", name: "Feature", color: "#6366f1" },
    { id: "lbl-bug", name: "Bugfix", color: "#ef4444" },
    { id: "lbl-perf", name: "Performance", color: "#10b981" },
    { id: "lbl-docs", name: "Documentation", color: "#38bdf8" },
    { id: "lbl-refactor", name: "Refactor", color: "#f59e0b" }
  ];
  var VIEWS = {
    HOME: "home",
    KANBAN: "kanban",
    SPRINT: "sprint",
    POMODORO: "pomodoro",
    ANALYTICS: "analytics",
    SETTINGS: "settings"
  };
  var POMODORO_MODES = {
    WORK: { id: "work", label: "Deep Focus", duration: 25 * 60 },
    SHORT_BREAK: { id: "short", label: "Short Break", duration: 5 * 60 },
    LONG_BREAK: { id: "long", label: "Long Break", duration: 15 * 60 }
  };

  // js/storage.js
  var STORAGE_KEYS = {
    TASKS: `${APP_CONFIG.STORAGE_PREFIX}tasks`,
    COLUMNS: `${APP_CONFIG.STORAGE_PREFIX}columns`,
    SPRINTS: `${APP_CONFIG.STORAGE_PREFIX}sprints`,
    ACTIVE_SPRINT: `${APP_CONFIG.STORAGE_PREFIX}active_sprint`,
    SETTINGS: `${APP_CONFIG.STORAGE_PREFIX}settings`,
    POMODORO_HISTORY: `${APP_CONFIG.STORAGE_PREFIX}pomodoro_history`
  };
  var INITIAL_SPRINT = {
    id: "sprint-1",
    name: "Sprint 1 \u2014 Core Architecture & MVP",
    goal: "Deliver primary authentication, database schema, and workstation UI layout.",
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
    status: "active"
    // 'planning', 'active', 'completed'
  };
  var INITIAL_TASKS = [
    {
      id: "TASK-101",
      title: "Implement JWT Access & Refresh Token Rotation",
      description: "Ensure secure token issuance with sliding refresh session expiration and blacklisting on logout.",
      columnId: "col-in-progress",
      sprintId: "sprint-1",
      priority: PRIORITIES.URGENT.id,
      labels: ["lbl-feat"],
      estimateHours: 5,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      subtasks: [
        { id: "sub-1", title: "Setup RS256 key pair generator", completed: true },
        { id: "sub-2", title: "Write token verification middleware", completed: true },
        { id: "sub-3", title: "Add Redis refresh token store", completed: false }
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "TASK-102",
      title: "Configure PostgreSQL Connection Pool & Read Replicas",
      description: "Tune max_connections, idle_timeout, and implement pgBouncer for high concurrency spikes.",
      columnId: "col-backlog",
      sprintId: "sprint-1",
      priority: PRIORITIES.HIGH.id,
      labels: ["lbl-perf"],
      estimateHours: 8,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      subtasks: [
        { id: "sub-4", title: "Benchmark current query latency under 500 RPS", completed: false },
        { id: "sub-5", title: "Deploy pgBouncer config file", completed: false }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "TASK-103",
      title: "Design Glassmorphism Dashboard UI Components",
      description: "Craft responsive Kanban columns, drag indicators, badge tags, and modern dark mode typography.",
      columnId: "col-review",
      sprintId: "sprint-1",
      priority: PRIORITIES.MEDIUM.id,
      labels: ["lbl-feat"],
      estimateHours: 6,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      subtasks: [
        { id: "sub-6", title: "Define CSS design tokens and variables", completed: true },
        { id: "sub-7", title: "Build responsive grid and sidebar", completed: true },
        { id: "sub-8", title: "Review accessibility contrast ratio", completed: false }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "TASK-104",
      title: "Setup Automated GitHub Actions CI/CD Pipeline",
      description: "Automate linting, unit test execution, and preview branch deployments.",
      columnId: "col-done",
      sprintId: "sprint-1",
      priority: PRIORITIES.LOW.id,
      labels: ["lbl-docs"],
      estimateHours: 3,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      subtasks: [
        { id: "sub-9", title: "Create .github/workflows/ci.yml", completed: true },
        { id: "sub-10", title: "Configure caching for npm dependencies", completed: true }
      ],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "TASK-105",
      title: "Fix WebSocket Heartbeat & Reconnection Jitter",
      description: "Address reconnect storms by implementing exponential backoff with full jitter.",
      columnId: "col-in-progress",
      sprintId: "sprint-1",
      priority: PRIORITIES.HIGH.id,
      labels: ["lbl-bug", "lbl-perf"],
      estimateHours: 4,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      subtasks: [
        { id: "sub-11", title: "Simulate packet loss in test environment", completed: true },
        { id: "sub-12", title: "Implement backoff algorithm with jitter", completed: false }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
    }
  ];
  var StorageEngine = class {
    constructor() {
      this.seedIfEmpty();
    }
    seedIfEmpty() {
      if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
        this.saveTasks(INITIAL_TASKS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.COLUMNS)) {
        this.saveColumns(DEFAULT_COLUMNS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.SPRINTS)) {
        this.saveSprints([INITIAL_SPRINT]);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SPRINT, INITIAL_SPRINT.id);
      }
      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        this.saveSettings({
          pomodoroWork: 25,
          pomodoroShortBreak: 5,
          pomodoroLongBreak: 15,
          soundEnabled: true,
          autoStartBreaks: false
        });
      }
    }
    // Tasks
    getTasks() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.TASKS);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    }
    saveTasks(tasks) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
    getTask(id) {
      return this.getTasks().find((t) => t.id === id) || null;
    }
    saveTask(task) {
      const tasks = this.getTasks();
      const idx = tasks.findIndex((t) => t.id === task.id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], ...task, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      } else {
        tasks.unshift({ ...task, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      }
      this.saveTasks(tasks);
      return task;
    }
    deleteTask(id) {
      const tasks = this.getTasks().filter((t) => t.id !== id);
      this.saveTasks(tasks);
    }
    // Columns
    getColumns() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.COLUMNS);
        return data ? JSON.parse(data) : DEFAULT_COLUMNS;
      } catch {
        return DEFAULT_COLUMNS;
      }
    }
    saveColumns(columns) {
      localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
    }
    // Sprints
    getSprints() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SPRINTS);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    }
    saveSprints(sprints) {
      localStorage.setItem(STORAGE_KEYS.SPRINTS, JSON.stringify(sprints));
    }
    getActiveSprintId() {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_SPRINT) || "sprint-1";
    }
    setActiveSprintId(id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SPRINT, id);
    }
    // Settings
    getSettings() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : {};
      } catch {
        return {};
      }
    }
    saveSettings(settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
    // Pomodoro Sessions
    getPomodoroHistory() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.POMODORO_HISTORY);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    }
    savePomodoroSession(session) {
      const history = this.getPomodoroHistory();
      history.unshift({ ...session, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
      localStorage.setItem(STORAGE_KEYS.POMODORO_HISTORY, JSON.stringify(history));
    }
  };
  var storage = new StorageEngine();

  // js/state.js
  var EVENTS = {
    STATE_INITIALIZED: "state:initialized",
    TASKS_CHANGED: "tasks:changed",
    TASK_CREATED: "task:created",
    TASK_UPDATED: "task:updated",
    TASK_DELETED: "task:deleted",
    TASK_MOVED: "task:moved",
    SPRINT_CHANGED: "sprint:changed",
    FILTER_CHANGED: "filter:changed",
    SEARCH_CHANGED: "search:changed"
  };
  var EventBus = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Map();
    }
    subscribe(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, /* @__PURE__ */ new Set());
      }
      this.listeners.get(event).add(callback);
      return () => this.listeners.get(event).delete(callback);
    }
    publish(event, payload) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach((cb) => {
          try {
            cb(payload);
          } catch (err) {
            console.error(`[EventBus] Error in listener for ${event}:`, err);
          }
        });
      }
    }
  };
  var bus = new EventBus();
  var StateStore = class {
    constructor() {
      this.tasks = [];
      this.columns = [];
      this.sprints = [];
      this.activeSprintId = null;
      this.searchQuery = "";
      this.filters = {
        priority: "all",
        label: "all"
      };
      this.init();
    }
    init() {
      this.tasks = storage.getTasks();
      this.columns = storage.getColumns();
      this.sprints = storage.getSprints();
      this.activeSprintId = storage.getActiveSprintId();
      bus.publish(EVENTS.STATE_INITIALIZED, this.getState());
    }
    getState() {
      return {
        tasks: this.tasks,
        columns: this.columns,
        sprints: this.sprints,
        activeSprintId: this.activeSprintId,
        searchQuery: this.searchQuery,
        filters: this.filters
      };
    }
    // Filtered Tasks Selector
    getFilteredTasks() {
      let result = [...this.tasks];
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(
          (t) => t.title.toLowerCase().includes(q) || t.description && t.description.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
        );
      }
      if (this.filters.priority && this.filters.priority !== "all") {
        result = result.filter((t) => t.priority === this.filters.priority);
      }
      if (this.filters.label && this.filters.label !== "all") {
        result = result.filter((t) => t.labels && t.labels.includes(this.filters.label));
      }
      return result;
    }
    getTasksByColumn(columnId) {
      return this.getFilteredTasks().filter((t) => t.columnId === columnId);
    }
    // Mutations
    createTask(taskData) {
      const nextNum = Math.floor(100 + Math.random() * 900);
      const newTask = {
        id: `TASK-${nextNum}`,
        columnId: "col-backlog",
        sprintId: this.activeSprintId,
        subtasks: [],
        labels: [],
        ...taskData,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      storage.saveTask(newTask);
      this.tasks.unshift(newTask);
      bus.publish(EVENTS.TASK_CREATED, newTask);
      bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
      return newTask;
    }
    updateTask(updatedTask) {
      storage.saveTask(updatedTask);
      const idx = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (idx !== -1) {
        this.tasks[idx] = updatedTask;
      }
      bus.publish(EVENTS.TASK_UPDATED, updatedTask);
      bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
      return updatedTask;
    }
    deleteTask(taskId) {
      storage.deleteTask(taskId);
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
      bus.publish(EVENTS.TASK_DELETED, taskId);
      bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
    }
    moveTask(taskId, targetColumnId, targetIndex = null) {
      const task = this.tasks.find((t) => t.id === taskId);
      if (!task) return;
      task.columnId = targetColumnId;
      task.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      if (targetIndex !== null) {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.tasks.splice(targetIndex, 0, task);
      }
      storage.saveTasks(this.tasks);
      bus.publish(EVENTS.TASK_MOVED, { task, targetColumnId });
      bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
    }
    setSearchQuery(query) {
      this.searchQuery = query;
      bus.publish(EVENTS.SEARCH_CHANGED, query);
      bus.publish(EVENTS.FILTER_CHANGED, this.filters);
    }
    setFilter(filterKey, value) {
      this.filters[filterKey] = value;
      bus.publish(EVENTS.FILTER_CHANGED, this.filters);
    }
    setActiveSprint(sprintId) {
      this.activeSprintId = sprintId;
      storage.setActiveSprintId(sprintId);
      bus.publish(EVENTS.SPRINT_CHANGED, sprintId);
    }
  };
  var state = new StateStore();

  // js/taskModal.js
  var TaskModalController = class {
    constructor() {
      this.dialog = document.getElementById("task-modal");
      this.form = document.getElementById("task-form");
      this.modalBody = document.getElementById("task-modal-body");
      this.modalTitle = document.getElementById("taskModalTitle");
      this.closeBtn = document.getElementById("btn-close-task-modal");
      this.cancelBtn = document.getElementById("btn-cancel-task");
      this.currentEditingTaskId = null;
      this.currentSubtasks = [];
      this.init();
    }
    init() {
      if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.close());
      if (this.cancelBtn) this.cancelBtn.addEventListener("click", () => this.close());
      if (this.form) {
        this.form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.handleSave();
        });
      }
    }
    openNew(columnId = "col-backlog") {
      this.currentEditingTaskId = null;
      this.currentSubtasks = [];
      this.modalTitle.textContent = "Create New Task";
      this.renderFormFields({
        title: "",
        description: "",
        columnId,
        priority: PRIORITIES.MEDIUM.id,
        estimateHours: 4,
        dueDate: "",
        labels: ["lbl-feat"],
        subtasks: []
      });
      this.dialog.showModal();
    }
    open(taskId) {
      const task = state.tasks.find((t) => t.id === taskId);
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
        <textarea id="task-input-desc" class="form-control" rows="3" placeholder="Provide background, ACs, or implementation details...">${escapeHtml(task.description || "")}</textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="form-group">
          <label class="form-label" for="task-input-column">Column Lifecycle</label>
          <select id="task-input-column" class="form-control">
            ${columns.map((c) => `<option value="${c.id}" ${c.id === task.columnId ? "selected" : ""}>${c.title}</option>`).join("")}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="task-input-priority">Priority</label>
          <select id="task-input-priority" class="form-control">
            ${Object.values(PRIORITIES).map((p) => `
              <option value="${p.id}" ${p.id === task.priority ? "selected" : ""}>${p.icon} ${p.label}</option>
            `).join("")}
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
          <input type="date" id="task-input-due" class="form-control" value="${task.dueDate || ""}">
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
          ${DEFAULT_LABELS.map((lbl) => {
        const checked = (task.labels || []).includes(lbl.id);
        return `
              <label style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: var(--radius-full); background: var(--bg-surface-elevated); border: 1px solid var(--border-default); cursor: pointer; font-size: 0.8rem;">
                <input type="checkbox" name="task-label-chip" value="${lbl.id}" ${checked ? "checked" : ""}>
                <span style="color: ${lbl.color}; font-weight: 600;">\u25CF</span>
                <span>${lbl.name}</span>
              </label>
            `;
      }).join("")}
        </div>
      </div>

      ${isEdit ? `
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-outline" id="btn-delete-task" style="color: var(--priority-urgent); border-color: var(--priority-urgent);">\u{1F5D1}\uFE0F Delete Task</button>
        </div>
      ` : ""}
    `;
      this.renderSubtaskList();
      this.bindSubtaskEvents();
      if (isEdit) {
        const delBtn = document.getElementById("btn-delete-task");
        if (delBtn) {
          delBtn.addEventListener("click", () => {
            if (confirm(`Are you sure you want to delete ${this.currentEditingTaskId}?`)) {
              state.deleteTask(this.currentEditingTaskId);
              this.close();
              if (window.TaskForge) window.TaskForge.showToast("Task deleted", "error");
            }
          });
        }
      }
    }
    renderSubtaskList() {
      const container = document.getElementById("subtasks-container");
      if (!container) return;
      if (this.currentSubtasks.length === 0) {
        container.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-dim);">No subtasks yet.</span>`;
        return;
      }
      container.innerHTML = this.currentSubtasks.map((st, i) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); font-size: 0.85rem;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; flex: 1;">
          <input type="checkbox" data-index="${i}" class="subtask-checkbox" ${st.completed ? "checked" : ""}>
          <span style="${st.completed ? "text-decoration: line-through; color: var(--text-muted);" : ""}">${escapeHtml(st.title)}</span>
        </label>
        <button type="button" data-index="${i}" class="btn-del-subtask" style="color: var(--text-dim); padding: 2px 6px;">\u2716</button>
      </div>
    `).join("");
      container.querySelectorAll(".subtask-checkbox").forEach((cb) => {
        cb.addEventListener("change", (e) => {
          const idx = parseInt(e.target.dataset.index);
          this.currentSubtasks[idx].completed = e.target.checked;
          this.renderSubtaskList();
        });
      });
      container.querySelectorAll(".btn-del-subtask").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(e.target.dataset.index);
          this.currentSubtasks.splice(idx, 1);
          this.renderSubtaskList();
        });
      });
    }
    bindSubtaskEvents() {
      const addBtn = document.getElementById("btn-add-subtask");
      const input = document.getElementById("new-subtask-input");
      const handleAdd = () => {
        const val = input.value.trim();
        if (!val) return;
        this.currentSubtasks.push({
          id: `sub-${Date.now()}`,
          title: val,
          completed: false
        });
        input.value = "";
        this.renderSubtaskList();
      };
      if (addBtn && input) {
        addBtn.addEventListener("click", handleAdd);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        });
      }
    }
    handleSave() {
      const title = document.getElementById("task-input-title").value.trim();
      if (!title) return;
      const description = document.getElementById("task-input-desc").value.trim();
      const columnId = document.getElementById("task-input-column").value;
      const priority = document.getElementById("task-input-priority").value;
      const estimateHours = parseFloat(document.getElementById("task-input-estimate").value) || 0;
      const dueDate = document.getElementById("task-input-due").value;
      const labelBoxes = document.querySelectorAll('input[name="task-label-chip"]:checked');
      const labels = Array.from(labelBoxes).map((b) => b.value);
      const taskPayload = {
        title,
        description,
        columnId,
        priority,
        estimateHours,
        dueDate,
        labels,
        subtasks: this.currentSubtasks
      };
      if (this.currentEditingTaskId) {
        const existing = state.tasks.find((t) => t.id === this.currentEditingTaskId);
        state.updateTask({ ...existing, ...taskPayload });
        if (window.TaskForge) window.TaskForge.showToast("Task updated successfully!", "success");
      } else {
        state.createTask(taskPayload);
        if (window.TaskForge) window.TaskForge.showToast("New task created!", "success");
      }
      this.close();
    }
  };
  function escapeHtml(text) {
    if (!text) return "";
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }
  var taskModal = new TaskModalController();

  // js/home.js
  var HomeController = class {
    constructor() {
      this.container = document.getElementById("home-container");
      this.init();
    }
    init() {
      bus.subscribe(EVENTS.STATE_INITIALIZED, () => this.render());
      bus.subscribe(EVENTS.TASKS_CHANGED, () => this.render());
      bus.subscribe(EVENTS.SPRINT_CHANGED, () => this.render());
      this.render();
    }
    getGreeting() {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 17) return "Good Afternoon";
      return "Good Evening";
    }
    getFormattedDate() {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      return (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, options);
    }
    render() {
      if (!this.container) return;
      const tasks = state.tasks;
      const activeSprint = state.sprints.find((s) => s.id === state.activeSprintId) || {
        name: "Sprint 1",
        goal: "Deliver core workstation MVP",
        startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        endDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      const sprintTasks = tasks.filter((t) => t.sprintId === state.activeSprintId);
      const sprintDone = sprintTasks.filter((t) => t.columnId === "col-done").length;
      const sprintPct = sprintTasks.length > 0 ? Math.round(sprintDone / sprintTasks.length * 100) : 0;
      const urgentTasks = tasks.filter((t) => (t.priority === "urgent" || t.priority === "high") && t.columnId !== "col-done");
      const wipTasks = tasks.filter((t) => t.columnId === "col-in-progress" || t.columnId === "col-review");
      const pomoHistory = storage.getPomodoroHistory();
      const pomoMinutes = pomoHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
      const pomoHours = (pomoMinutes / 60).toFixed(1);
      const actionItems = tasks.filter((t) => t.columnId !== "col-done").sort((a, b) => {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priority] || 2) - (order[b.priority] || 2);
      }).slice(0, 5);
      this.container.innerHTML = `
      <div class="home-layout-container">
        <!-- 1. Hero Welcome Banner -->
        <div class="home-hero-card">
          <div class="hero-left">
            <div class="hero-greeting-line">
              <h1 class="hero-greeting">${this.getGreeting()}, Developer \u{1F44B}</h1>
              <span class="hero-sprint-pill">
                <span>\u{1F3C3}</span> ${escapeHtml2(activeSprint.name)} \u2022 Active
              </span>
            </div>
            <p class="hero-subtitle">
              Welcome to your engineering workstation. Track sprints, manage Kanban cards, and maintain deep focus.
            </p>
            <div class="hero-date-badge">
              <span>\u{1F4C5} ${this.getFormattedDate()}</span>
            </div>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" id="btn-hero-new-task">
              <span>+</span> New Task
            </button>
            <button class="btn btn-secondary" id="btn-hero-start-pomo">
              <span>\u23F1\uFE0F</span> Quick Focus (25m)
            </button>
          </div>
        </div>

        <!-- 2. Executive KPI Metrics Ribbon -->
        <div class="home-kpi-grid">
          <div class="home-kpi-card" data-jump="sprint">
            <div class="kpi-top">
              <span>Sprint Velocity</span>
              <div class="kpi-icon-badge" style="background: var(--color-primary-light); color: var(--color-primary);">\u{1F3AF}</div>
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
              <div class="kpi-icon-badge" style="background: var(--priority-urgent-bg); color: var(--priority-urgent);">\u{1F525}</div>
            </div>
            <div class="kpi-val">${urgentTasks.length}</div>
            <div class="kpi-subtext">Critical & high priority items</div>
          </div>

          <div class="home-kpi-card" data-jump="kanban">
            <div class="kpi-top">
              <span>Active WIP Load</span>
              <div class="kpi-icon-badge" style="background: rgba(14, 165, 233, 0.15); color: var(--color-accent);">\u26A1</div>
            </div>
            <div class="kpi-val">${wipTasks.length}</div>
            <div class="kpi-subtext">Tasks in progress or review</div>
          </div>

          <div class="home-kpi-card" data-jump="pomodoro">
            <div class="kpi-top">
              <span>Focus Logged</span>
              <div class="kpi-icon-badge" style="background: var(--priority-low-bg); color: var(--priority-low);">\u23F1\uFE0F</div>
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
                  <span>\u{1F525}</span> Priority Action Items
                </h2>
                <button class="btn btn-outline btn-sm" id="btn-view-all-board">
                  View Full Board \u2794
                </button>
              </div>

              <div class="action-tasks-list">
                ${actionItems.length === 0 ? `
                  <div style="padding: 20px; text-align: center; color: var(--text-dim); font-size: 0.88rem;">
                    \u{1F389} All caught up! No high-priority blockers currently pending.
                  </div>
                ` : actionItems.map((task) => this.renderActionTask(task)).join("")}
              </div>
            </div>

            <!-- Workstation Quick Launchpad -->
            <div class="launchpad-card">
              <div class="section-card-header">
                <h2 class="section-card-title">
                  <span>\u{1F680}</span> Workstation Launchpad
                </h2>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Instant Navigation</span>
              </div>

              <div class="launchpad-grid">
                <div class="launch-tile" data-jump="kanban">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #6366f1;">\u{1F4CB}</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">${tasks.length} tasks</span>
                  </div>
                  <h4>Kanban Board</h4>
                  <p>Drag and drop cards across Backlog, In Progress, Review, and Done stages.</p>
                  <div class="launch-tile-cta">Open Board \u2794</div>
                </div>

                <div class="launch-tile" data-jump="sprint">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #38bdf8;">\u{1F3C3}</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">${sprintTasks.length} in sprint</span>
                  </div>
                  <h4>Sprint Planner</h4>
                  <p>Manage sprint capacity, shift items from product backlog, track sprint goals.</p>
                  <div class="launch-tile-cta">View Sprint \u2794</div>
                </div>

                <div class="launch-tile" data-jump="pomodoro">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #f59e0b;">\u23F1\uFE0F</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">25m / 5m</span>
                  </div>
                  <h4>Pomodoro Timer</h4>
                  <p>Block distractions with structured intervals and synthesized audio chimes.</p>
                  <div class="launch-tile-cta">Start Timer \u2794</div>
                </div>

                <div class="launch-tile" data-jump="analytics">
                  <div class="launch-tile-top">
                    <div class="launch-tile-icon" style="color: #10b981;">\u{1F4CA}</div>
                    <span style="font-size: 0.72rem; color: var(--text-dim);">Live metrics</span>
                  </div>
                  <h4>Velocity Analytics</h4>
                  <p>Inspect team throughput, priority distributions, and pipeline bottlenecks.</p>
                  <div class="launch-tile-cta">Inspect Velocity \u2794</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Side Column -->
          <div class="home-side-col">
            <!-- Active Sprint Radar -->
            <div class="home-side-card">
              <div class="section-card-header">
                <h3 style="font-size: var(--text-md); font-weight: 700;">\u{1F3AF} Sprint Radar</h3>
                <span class="badge badge-priority-low">Active</span>
              </div>
              <p style="font-size: var(--text-sm); color: var(--text-muted);">
                ${escapeHtml2(activeSprint.goal)}
              </p>

              <div class="radar-pipeline-rows">
                ${state.columns.map((col) => {
        const count = tasks.filter((t) => t.columnId === col.id).length;
        return `
                    <div class="radar-row">
                      <div class="radar-row-left">
                        <span class="column-color-indicator" style="background-color: ${col.color};"></span>
                        <span>${escapeHtml2(col.title)}</span>
                      </div>
                      <span class="radar-count">${count}</span>
                    </div>
                  `;
      }).join("")}
              </div>
            </div>

            <!-- Recent Activity Stream -->
            <div class="home-side-card">
              <div class="section-card-header">
                <h3 style="font-size: var(--text-md); font-weight: 700;">\u{1F4DC} Recent Activity</h3>
                <span style="font-size: var(--text-xs); color: var(--text-dim);">Live Log</span>
              </div>
              <div class="activity-feed-list">
                <div class="feed-item">
                  <div class="feed-bullet"></div>
                  <div class="feed-content">
                    <strong>TASK-101</strong> updated priority to Urgent
                    <span>Today \u2022 In Progress</span>
                  </div>
                </div>
                <div class="feed-item">
                  <div class="feed-bullet" style="background: var(--status-success); box-shadow: 0 0 6px var(--status-success);"></div>
                  <div class="feed-content">
                    <strong>TASK-104</strong> moved to Completed
                    <span>Yesterday \u2022 Done</span>
                  </div>
                </div>
                <div class="feed-item">
                  <div class="feed-bullet" style="background: var(--color-accent); box-shadow: 0 0 6px var(--color-accent);"></div>
                  <div class="feed-content">
                    <strong>Sprint 1</strong> milestone initialized
                    <span>3 days ago \u2022 Milestone</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pro Shortcuts Card -->
            <div class="home-side-card" style="background: linear-gradient(135deg, var(--bg-surface), var(--bg-surface-elevated));">
              <div class="section-card-header">
                <h3 style="font-size: var(--text-md); font-weight: 700;">\u26A1 Pro Shortcuts</h3>
                <span>\u2328\uFE0F</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: var(--text-sm); color: var(--text-muted);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>New Task</span> <kbd>N</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Global Search</span> <kbd>Ctrl+K</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Kanban Board</span> <kbd>1</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Pomodoro Timer</span> <kbd>3</kbd>
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
      const priorityObj = Object.values(PRIORITIES).find((p) => p.id === task.priority) || PRIORITIES.MEDIUM;
      const colObj = state.columns.find((c) => c.id === task.columnId) || { title: task.columnId };
      const subtasks = task.subtasks || [];
      const doneCount = subtasks.filter((s) => s.completed).length;
      return `
      <div class="action-task-item" data-id="${task.id}">
        <div class="action-task-left">
          <input type="checkbox" class="task-action-check" data-id="${task.id}" title="Mark completed" style="width: 16px; height: 16px; cursor: pointer; accent-color: var(--status-success);">
          <span class="badge badge-priority-${task.priority}">${priorityObj.icon} ${priorityObj.label}</span>
          <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-dim);">${task.id}</span>
          <span class="action-task-title">${escapeHtml2(task.title)}</span>
        </div>
        <div class="action-task-right">
          ${subtasks.length > 0 ? `
            <span style="font-size: var(--text-xs); color: var(--text-dim);">\u2611 ${doneCount}/${subtasks.length}</span>
          ` : ""}
          <span style="font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-xs); background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-muted);">
            ${escapeHtml2(colObj.title)}
          </span>
          ${task.dueDate ? `
            <span style="font-size: var(--text-xs); color: var(--text-muted);">\u{1F4C5} ${task.dueDate}</span>
          ` : ""}
        </div>
      </div>
    `;
    }
    bindEvents() {
      const heroNewTask = document.getElementById("btn-hero-new-task");
      if (heroNewTask) {
        heroNewTask.addEventListener("click", () => taskModal.openNew());
      }
      const heroStartPomo = document.getElementById("btn-hero-start-pomo");
      if (heroStartPomo) {
        heroStartPomo.addEventListener("click", () => {
          if (window.TaskForge) window.TaskForge.switchView(VIEWS.POMODORO);
        });
      }
      const viewAllBoard = document.getElementById("btn-view-all-board");
      if (viewAllBoard) {
        viewAllBoard.addEventListener("click", () => {
          if (window.TaskForge) window.TaskForge.switchView(VIEWS.KANBAN);
        });
      }
      this.container.querySelectorAll("[data-jump]").forEach((el) => {
        el.addEventListener("click", () => {
          const targetView = el.dataset.jump;
          if (window.TaskForge && targetView) {
            window.TaskForge.switchView(targetView);
          }
        });
      });
      this.container.querySelectorAll(".action-task-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          if (e.target.classList.contains("task-action-check")) return;
          const taskId = item.dataset.id;
          if (taskId) taskModal.open(taskId);
        });
      });
      this.container.querySelectorAll(".task-action-check").forEach((cb) => {
        cb.addEventListener("click", (e) => {
          e.stopPropagation();
        });
        cb.addEventListener("change", (e) => {
          const taskId = cb.dataset.id;
          if (e.target.checked && taskId) {
            state.moveTask(taskId, "col-done");
            if (window.TaskForge) window.TaskForge.showToast(`Task ${taskId} completed!`, "success");
          }
        });
      });
    }
  };
  function escapeHtml2(text) {
    if (!text) return "";
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  // js/kanban.js
  var KanbanBoardController = class {
    constructor() {
      this.container = document.getElementById("kanban-board");
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
      const filterContainer = document.getElementById("kanban-filters");
      if (!filterContainer) return;
      filterContainer.innerHTML = `
      <div class="filter-bar">
        <select id="filter-select-priority" class="filter-select">
          <option value="all">All Priorities</option>
          ${Object.values(PRIORITIES).map((p) => `
            <option value="${p.id}" ${state.filters.priority === p.id ? "selected" : ""}>${p.icon} ${p.label}</option>
          `).join("")}
        </select>

        <select id="filter-select-label" class="filter-select">
          <option value="all">All Labels</option>
          ${DEFAULT_LABELS.map((l) => `
            <option value="${l.id}" ${state.filters.label === l.id ? "selected" : ""}>\u25CF ${l.name}</option>
          `).join("")}
        </select>

        ${state.filters.priority !== "all" || state.filters.label !== "all" || state.searchQuery ? `
          <button id="btn-clear-filters" class="btn btn-outline btn-sm" style="font-size: 0.75rem;">Clear Filters \u2716</button>
        ` : ""}
      </div>
    `;
      const prioritySelect = document.getElementById("filter-select-priority");
      if (prioritySelect) {
        prioritySelect.addEventListener("change", (e) => {
          state.setFilter("priority", e.target.value);
          this.renderFilters();
        });
      }
      const labelSelect = document.getElementById("filter-select-label");
      if (labelSelect) {
        labelSelect.addEventListener("change", (e) => {
          state.setFilter("label", e.target.value);
          this.renderFilters();
        });
      }
      const clearBtn = document.getElementById("btn-clear-filters");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          state.setFilter("priority", "all");
          state.setFilter("label", "all");
          state.setSearchQuery("");
          const searchInput = document.getElementById("global-search-input");
          if (searchInput) searchInput.value = "";
          this.renderFilters();
        });
      }
    }
    render() {
      if (!this.container) return;
      this.container.innerHTML = "";
      const columns = state.columns;
      columns.forEach((col) => {
        const tasks = state.getTasksByColumn(col.id);
        const isOverLimit = col.limit && tasks.length > col.limit;
        const colEl = document.createElement("div");
        colEl.className = "kanban-column";
        colEl.dataset.columnId = col.id;
        colEl.innerHTML = `
        <div class="column-header">
          <div class="column-title-group">
            <span class="column-color-indicator" style="background-color: ${col.color};"></span>
            <span class="column-title">${escapeHtml3(col.title)}</span>
            <span class="column-count-badge ${isOverLimit ? "badge-priority-urgent" : ""}">
              ${tasks.length}${col.limit ? ` / ${col.limit}` : ""}
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
        const cardsList = colEl.querySelector(".kanban-cards-list");
        tasks.forEach((task) => {
          const cardEl = this.createCardElement(task);
          cardsList.appendChild(cardEl);
        });
        this.bindDropZone(cardsList, col.id);
        this.container.appendChild(colEl);
      });
      this.container.querySelectorAll(".btn-add-card-inline").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const colId = btn.dataset.column;
          taskModal.openNew(colId);
        });
      });
    }
    createCardElement(task) {
      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.taskId = task.id;
      const subtasks = task.subtasks || [];
      const doneCount = subtasks.filter((s) => s.completed).length;
      const pct = subtasks.length > 0 ? Math.round(doneCount / subtasks.length * 100) : 0;
      const priorityObj = Object.values(PRIORITIES).find((p) => p.id === task.priority) || PRIORITIES.MEDIUM;
      let dueHtml = "";
      if (task.dueDate) {
        const isOverdue = new Date(task.dueDate) < /* @__PURE__ */ new Date() && task.columnId !== "col-done";
        dueHtml = `
        <span class="card-due-date ${isOverdue ? "overdue" : ""}">
          \u{1F4C5} ${task.dueDate}
        </span>
      `;
      }
      const labelsHtml = (task.labels || []).map((lid) => {
        const def = DEFAULT_LABELS.find((l) => l.id === lid);
        return def ? `<span class="card-label-chip" style="background-color: ${def.color};">${def.name}</span>` : "";
      }).join("");
      card.innerHTML = `
      <div class="card-top">
        <span class="card-id">${task.id}</span>
        <span class="badge badge-priority-${task.priority}">
          ${priorityObj.icon} ${priorityObj.label}
        </span>
      </div>

      <h3 class="card-title">${escapeHtml3(task.title)}</h3>
      ${task.description ? `<p class="card-desc-snippet">${escapeHtml3(task.description)}</p>` : ""}

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
      ` : ""}

      <div class="card-bottom">
        <div class="card-labels">${labelsHtml}</div>
        <div>${dueHtml}</div>
      </div>
    `;
      card.addEventListener("click", () => {
        taskModal.open(task.id);
      });
      card.addEventListener("dragstart", (e) => {
        this.draggedTaskId = task.id;
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
      });
      card.addEventListener("dragend", () => {
        this.draggedTaskId = null;
        card.classList.remove("dragging");
        document.querySelectorAll(".kanban-column").forEach((c) => c.classList.remove("drag-over"));
      });
      return card;
    }
    bindDropZone(cardsList, columnId) {
      cardsList.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const colEl = cardsList.closest(".kanban-column");
        if (colEl) colEl.classList.add("drag-over");
      });
      cardsList.addEventListener("dragleave", (e) => {
        if (!cardsList.contains(e.relatedTarget)) {
          const colEl = cardsList.closest(".kanban-column");
          if (colEl) colEl.classList.remove("drag-over");
        }
      });
      cardsList.addEventListener("drop", (e) => {
        e.preventDefault();
        const colEl = cardsList.closest(".kanban-column");
        if (colEl) colEl.classList.remove("drag-over");
        const taskId = e.dataTransfer.getData("text/plain") || this.draggedTaskId;
        if (!taskId) return;
        const cards = Array.from(cardsList.querySelectorAll(".task-card:not(.dragging)"));
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
          window.TaskForge.showToast(`Task moved to ${columnId.replace("col-", "").replace("-", " ")}`);
        }
      });
    }
  };
  function escapeHtml3(text) {
    if (!text) return "";
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  // js/sprint.js
  var SprintPlannerController = class {
    constructor() {
      this.container = document.getElementById("sprint-container");
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
      this.container.innerHTML = "";
      const activeSprintId = state.activeSprintId;
      const sprint = state.sprints.find((s) => s.id === activeSprintId) || {
        id: "sprint-1",
        name: "Sprint 1",
        goal: "No active sprint set",
        startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        endDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        status: "active"
      };
      const allTasks = state.tasks;
      const sprintTasks = allTasks.filter((t) => t.sprintId === sprint.id);
      const backlogTasks = allTasks.filter((t) => t.sprintId !== sprint.id);
      const completedTasks = sprintTasks.filter((t) => t.columnId === "col-done").length;
      const progressPct = sprintTasks.length > 0 ? Math.round(completedTasks / sprintTasks.length * 100) : 0;
      const totalHours = sprintTasks.reduce((acc, t) => acc + (t.estimateHours || 0), 0);
      this.container.innerHTML = `
      <!-- Active Sprint Hero Card -->
      <div class="sprint-hero-card">
        <div class="sprint-hero-header">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span class="sprint-badge-status">${sprint.status}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">\u{1F4C5} ${sprint.startDate} \u2014 ${sprint.endDate}</span>
            </div>
            <h2 class="sprint-title">${escapeHtml4(sprint.name)}</h2>
            <p class="sprint-goal-text">\u{1F3AF} <strong>Goal:</strong> ${escapeHtml4(sprint.goal)}</p>
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
          <h3 style="font-size: 1.1rem; font-weight: 700;">Tasks in ${escapeHtml4(sprint.name)}</h3>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${sprintTasks.length} items</span>
        </div>
        <div class="backlog-list">
          ${sprintTasks.length === 0 ? `
            <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 0.9rem;">
              No tasks currently in this sprint. Assign tasks from the backlog below!
            </div>
          ` : sprintTasks.map((t) => this.renderTaskRow(t, true)).join("")}
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
          ` : backlogTasks.map((t) => this.renderTaskRow(t, false)).join("")}
        </div>
      </div>
    `;
      this.bindEvents(sprint.id);
    }
    renderTaskRow(task, inSprint) {
      const priorityObj = Object.values(PRIORITIES).find((p) => p.id === task.priority) || PRIORITIES.MEDIUM;
      const colObj = state.columns.find((c) => c.id === task.columnId) || { title: task.columnId };
      return `
      <div class="backlog-item" data-task-id="${task.id}">
        <div class="backlog-item-left">
          <span class="badge badge-priority-${task.priority}">${priorityObj.icon} ${priorityObj.label}</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${task.id}</span>
          <span class="backlog-item-title" style="cursor: pointer;">${escapeHtml4(task.title)}</span>
        </div>

        <div class="backlog-item-right">
          <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: var(--radius-xs); background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-muted);">
            ${colObj.title}
          </span>
          <span style="font-size: 0.8rem; color: var(--text-dim);">${task.estimateHours || 0}h</span>
          ${inSprint ? `
            <button class="btn btn-outline btn-sm btn-move-backlog" data-id="${task.id}" title="Remove from Sprint">
              \u21A9 To Backlog
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
      const addSprintTaskBtn = document.getElementById("btn-create-task-sprint");
      if (addSprintTaskBtn) {
        addSprintTaskBtn.addEventListener("click", () => {
          taskModal.openNew("col-backlog");
        });
      }
      this.container.querySelectorAll(".backlog-item-title").forEach((el) => {
        el.addEventListener("click", () => {
          const row = el.closest(".backlog-item");
          if (row && row.dataset.taskId) {
            taskModal.open(row.dataset.taskId);
          }
        });
      });
      this.container.querySelectorAll(".btn-move-sprint").forEach((btn) => {
        btn.addEventListener("click", () => {
          const taskId = btn.dataset.id;
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            state.updateTask({ ...task, sprintId: activeSprintId });
            if (window.TaskForge) window.TaskForge.showToast(`Task assigned to ${activeSprintId}`);
          }
        });
      });
      this.container.querySelectorAll(".btn-move-backlog").forEach((btn) => {
        btn.addEventListener("click", () => {
          const taskId = btn.dataset.id;
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            state.updateTask({ ...task, sprintId: null });
            if (window.TaskForge) window.TaskForge.showToast("Task moved back to product backlog");
          }
        });
      });
    }
  };
  function escapeHtml4(text) {
    if (!text) return "";
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  // js/pomodoro.js
  var PomodoroController = class {
    constructor() {
      this.container = document.getElementById("pomodoro-container");
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
      const inProgressTasks = state.tasks.filter((t) => t.columnId !== "col-done");
      this.container.innerHTML = `
      <div class="pomodoro-card">
        <!-- Mode Tabs -->
        <div class="pomodoro-mode-tabs">
          <button class="pomodoro-tab-btn ${this.currentMode.id === "work" ? "active" : ""}" data-mode="work">
            Deep Focus (25m)
          </button>
          <button class="pomodoro-tab-btn ${this.currentMode.id === "short" ? "active" : ""}" data-mode="short">
            Short Break (5m)
          </button>
          <button class="pomodoro-tab-btn ${this.currentMode.id === "long" ? "active" : ""}" data-mode="long">
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
            ${this.isRunning ? "Pause" : "Start Focus"}
          </button>
          <button class="btn btn-secondary btn-icon" id="btn-reset-timer" title="Reset Session">
            \u{1F504}
          </button>
        </div>

        <!-- Linked Task -->
        <div class="pomodoro-task-picker">
          <label for="pomodoro-task-select">Linked Task (Optional):</label>
          <select id="pomodoro-task-select" class="form-control">
            <option value="">-- No specific task --</option>
            ${inProgressTasks.map((t) => `
              <option value="${t.id}" ${this.selectedTaskId === t.id ? "selected" : ""}>${t.id}: ${escapeHtml5(t.title)}</option>
            `).join("")}
          </select>
        </div>
      </div>

      <!-- Footer Streak -->
      <div class="pomodoro-sessions-footer">
        <span class="pomodoro-fire-icon">\u{1F525}</span>
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
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    bindEvents() {
      this.container.querySelectorAll(".pomodoro-tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const modeKey = btn.dataset.mode.toUpperCase();
          const modeObj = POMODORO_MODES[modeKey] || (btn.dataset.mode === "short" ? POMODORO_MODES.SHORT_BREAK : POMODORO_MODES.LONG_BREAK);
          this.switchMode(modeObj);
        });
      });
      const toggleBtn = document.getElementById("btn-toggle-timer");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          if (this.isRunning) {
            this.pause();
          } else {
            this.start();
          }
        });
      }
      const resetBtn = document.getElementById("btn-reset-timer");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => this.reset());
      }
      const taskSelect = document.getElementById("pomodoro-task-select");
      if (taskSelect) {
        taskSelect.addEventListener("change", (e) => {
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
      const toggleBtn = document.getElementById("btn-toggle-timer");
      if (toggleBtn) {
        toggleBtn.textContent = "Pause";
        toggleBtn.classList.remove("btn-primary");
        toggleBtn.classList.add("btn-secondary");
      }
      this.timerId = setInterval(() => {
        this.tick();
      }, 1e3);
    }
    pause() {
      this.isRunning = false;
      clearInterval(this.timerId);
      const toggleBtn = document.getElementById("btn-toggle-timer");
      if (toggleBtn) {
        toggleBtn.textContent = "Resume";
        toggleBtn.classList.add("btn-primary");
        toggleBtn.classList.remove("btn-secondary");
      }
      document.title = "TaskForge OS";
    }
    reset() {
      this.pause();
      this.timeLeft = this.totalDuration;
      this.updateDisplay();
      const toggleBtn = document.getElementById("btn-toggle-timer");
      if (toggleBtn) {
        toggleBtn.textContent = "Start Focus";
        toggleBtn.classList.add("btn-primary");
        toggleBtn.classList.remove("btn-secondary");
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
      const digits = document.getElementById("timer-digits-display");
      const circle = document.getElementById("timer-progress-circle");
      const formatted = this.formatTime(this.timeLeft);
      if (digits) digits.textContent = formatted;
      if (circle) circle.style.strokeDashoffset = this.calculateOffset();
      document.title = `${formatted} (${this.currentMode.label}) \u2014 TaskForge`;
    }
    completeSession() {
      this.pause();
      this.playChime();
      if (this.currentMode.id === "work") {
        this.sessionsCompleted += 1;
        storage.savePomodoroSession({
          mode: this.currentMode.id,
          durationMinutes: 25,
          taskId: this.selectedTaskId
        });
        if (window.TaskForge) {
          window.TaskForge.showToast("\u{1F389} Focus session completed! Take a well-deserved break.", "success");
        }
        this.switchMode(POMODORO_MODES.SHORT_BREAK);
      } else {
        if (window.TaskForge) {
          window.TaskForge.showToast("Break finished! Ready for another focus sprint?", "info");
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
        const notes = [587.33, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.2);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.2);
          gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + idx * 0.2 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.2);
          osc.stop(ctx.currentTime + idx * 0.2 + 0.8);
        });
      } catch (e) {
        console.log("[Pomodoro] Audio chime could not play:", e);
      }
    }
  };
  function escapeHtml5(text) {
    if (!text) return "";
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  // js/analytics.js
  var AnalyticsController = class {
    constructor() {
      this.container = document.getElementById("analytics-container");
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
      const completed = tasks.filter((t) => t.columnId === "col-done").length;
      const inProgress = tasks.filter((t) => t.columnId === "col-in-progress").length;
      const inReview = tasks.filter((t) => t.columnId === "col-review").length;
      const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
      const totalHours = tasks.reduce((acc, t) => acc + (t.estimateHours || 0), 0);
      const completedHours = tasks.filter((t) => t.columnId === "col-done").reduce((acc, t) => acc + (t.estimateHours || 0), 0);
      const pomoHistory = storage.getPomodoroHistory();
      const pomoMinutes = pomoHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
      const pomoHours = (pomoMinutes / 60).toFixed(1);
      const priorityCounts = {
        urgent: tasks.filter((t) => t.priority === "urgent").length,
        high: tasks.filter((t) => t.priority === "high").length,
        medium: tasks.filter((t) => t.priority === "medium").length,
        low: tasks.filter((t) => t.priority === "low").length
      };
      this.container.innerHTML = `
      <!-- Top 4 Metric Cards -->
      <div class="analytics-stats-grid">
        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Completion Rate</span>
            <span>\u{1F3AF}</span>
          </div>
          <div class="stat-card-val">${completionRate}%</div>
          <div class="stat-card-sub">${completed} of ${total} tasks closed</div>
        </div>

        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Work In Progress (WIP)</span>
            <span>\u26A1</span>
          </div>
          <div class="stat-card-val">${inProgress + inReview}</div>
          <div class="stat-card-sub">${inProgress} active, ${inReview} in review</div>
        </div>

        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Committed Scope</span>
            <span>\u23F1\uFE0F</span>
          </div>
          <div class="stat-card-val">${totalHours}h</div>
          <div class="stat-card-sub">${completedHours}h completed so far</div>
        </div>

        <div class="analytics-stat-card">
          <div class="stat-card-top">
            <span>Focus Deep Work</span>
            <span>\u{1F525}</span>
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
            ${Object.values(PRIORITIES).map((p) => {
        const count = priorityCounts[p.id] || 0;
        const pct = total > 0 ? Math.round(count / total * 100) : 0;
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
      }).join("")}
          </div>
        </div>

        <!-- Lifecycle Column Distribution -->
        <div class="analytics-chart-card">
          <div class="chart-card-header">
            <h3 class="chart-card-title">Lifecycle Column Velocity</h3>
            <span style="font-size: 0.8rem; color: var(--text-dim);">Pipeline</span>
          </div>
          <div class="columns-dist-bars">
            ${state.columns.map((col) => {
        const count = tasks.filter((t) => t.columnId === col.id).length;
        const pct = total > 0 ? Math.round(count / total * 100) : 0;
        return `
                <div class="dist-item">
                  <div class="dist-item-top">
                    <span>\u25CF ${col.title}</span>
                    <span>${count} tasks (${pct}%)</span>
                  </div>
                  <div class="dist-bar-track">
                    <div class="dist-bar-fill" style="width: ${pct}%; background-color: ${col.color};"></div>
                  </div>
                </div>
              `;
      }).join("")}
          </div>
        </div>
      </div>
    `;
    }
  };

  // js/exporter.js
  var DataExporterController = class {
    constructor() {
      this.container = document.getElementById("settings-container");
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
          <h2 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">\u{1F4BE} Backup & Data Portability</h2>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            Export your entire workstation state into JSON or CSV format, or restore from a previously saved backup file.
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-export-json">
              \u{1F4E5} Download JSON Backup
            </button>
            <button class="btn btn-secondary" id="btn-export-csv">
              \u{1F4CA} Export Tasks to CSV
            </button>
            <label class="btn btn-outline" style="cursor: pointer;">
              \u{1F4E4} Restore from JSON
              <input type="file" id="input-restore-file" accept=".json" style="display: none;">
            </label>
          </div>
        </div>

        <!-- Preferences Card -->
        <div class="card" style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 24px;">
          <h2 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">\u2699\uFE0F Workspace Preferences</h2>
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
                \u26A0\uFE0F Reset All Data
              </button>
            </div>
          </div>
        </div>

        <!-- Workspace Info Card -->
        <div style="padding: 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); font-size: 0.82rem; color: var(--text-muted);">
          TaskForge OS v1.0.0 \u2022 Pure Vanilla Web Technology \u2022 Local-First Architecture \u2022 Zero telemetry.
        </div>
      </div>
    `;
      this.bindEvents();
    }
    bindEvents() {
      const exportJsonBtn = document.getElementById("btn-export-json");
      if (exportJsonBtn) {
        exportJsonBtn.addEventListener("click", () => this.exportJSON());
      }
      const exportCsvBtn = document.getElementById("btn-export-csv");
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", () => this.exportCSV());
      }
      const restoreInput = document.getElementById("input-restore-file");
      if (restoreInput) {
        restoreInput.addEventListener("change", (e) => this.restoreJSON(e));
      }
      const themeBtn = document.getElementById("btn-settings-theme");
      if (themeBtn) {
        themeBtn.addEventListener("click", () => {
          if (window.TaskForge) window.TaskForge.toggleTheme();
        });
      }
      const resetBtn = document.getElementById("btn-reset-demo");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to reset all tasks to demo data? Current local data will be replaced.")) {
            localStorage.clear();
            storage.seedIfEmpty();
            state.init();
            if (window.TaskForge) {
              window.TaskForge.showToast("Workspace reset to demo data!", "success");
            }
            this.render();
          }
        });
      }
    }
    exportJSON() {
      const backupData = {
        version: "1.0.0",
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        tasks: state.tasks,
        columns: state.columns,
        sprints: state.sprints,
        activeSprintId: state.activeSprintId,
        settings: storage.getSettings(),
        pomodoroHistory: storage.getPomodoroHistory()
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `taskforge_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (window.TaskForge) window.TaskForge.showToast("JSON backup exported successfully!", "success");
    }
    exportCSV() {
      const tasks = state.tasks;
      if (tasks.length === 0) {
        if (window.TaskForge) window.TaskForge.showToast("No tasks to export", "error");
        return;
      }
      const headers = ["ID", "Title", "Description", "Column", "Priority", "Estimate (Hours)", "Due Date", "Created At"];
      const rows = tasks.map((t) => [
        t.id,
        `"${(t.title || "").replace(/"/g, '""')}"`,
        `"${(t.description || "").replace(/"/g, '""')}"`,
        t.columnId,
        t.priority,
        t.estimateHours || 0,
        t.dueDate || "",
        t.createdAt || ""
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `taskforge_tasks_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      if (window.TaskForge) window.TaskForge.showToast("CSV spreadsheet exported successfully!", "success");
    }
    restoreJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (!data.tasks || !Array.isArray(data.tasks)) {
            throw new Error("Invalid TaskForge backup format");
          }
          storage.saveTasks(data.tasks);
          if (data.columns) storage.saveColumns(data.columns);
          if (data.sprints) storage.saveSprints(data.sprints);
          if (data.activeSprintId) storage.setActiveSprintId(data.activeSprintId);
          if (data.settings) storage.saveSettings(data.settings);
          state.init();
          if (window.TaskForge) {
            window.TaskForge.showToast("Workspace successfully restored!", "success");
          }
          this.render();
        } catch (err) {
          alert("Could not restore backup: " + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  // js/app.js
  var TaskForgeApp = class {
    constructor() {
      this.currentView = VIEWS.HOME;
      this.theme = localStorage.getItem("taskforge_theme") || APP_CONFIG.DEFAULT_THEME;
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
      this.bindNavigation();
      this.bindThemeToggle();
      this.bindShortcutsModal();
      this.bindDialogFallbacks();
      this.bindGlobalShortcuts();
      this.bindQuickAdd();
      this.bindSearchInput();
      this.bindStateListeners();
      this.updateCounters();
      this.home = new HomeController();
      this.kanbanBoard = new KanbanBoardController();
      this.sprintPlanner = new SprintPlannerController();
      this.pomodoro = new PomodoroController();
      this.analytics = new AnalyticsController();
      this.exporter = new DataExporterController();
      console.log(`[TaskForge OS] Bootstrapped v${APP_CONFIG.VERSION}`);
    }
    bindSearchInput() {
      const input = document.getElementById("global-search-input");
      if (!input) return;
      let debounceTimer;
      input.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.setSearchQuery(e.target.value);
        }, 200);
      });
    }
    bindQuickAdd() {
      const quickAddBtn = document.getElementById("btn-quick-add-task");
      if (quickAddBtn) {
        quickAddBtn.addEventListener("click", () => {
          taskModal.openNew();
        });
      }
    }
    bindStateListeners() {
      bus.subscribe(EVENTS.TASKS_CHANGED, () => this.updateCounters());
      bus.subscribe(EVENTS.STATE_INITIALIZED, () => this.updateCounters());
    }
    updateCounters() {
      const kanbanCount = document.getElementById("nav-count-kanban");
      if (kanbanCount) {
        kanbanCount.textContent = state.tasks.length;
      }
    }
    // Theme Management
    applyTheme(theme) {
      this.theme = theme;
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("taskforge_theme", theme);
      const themeIcon = document.getElementById("theme-icon");
      if (themeIcon) {
        themeIcon.textContent = theme === "dark" ? "\u{1F319}" : "\u2600\uFE0F";
      }
    }
    toggleTheme() {
      const nextTheme = this.theme === "dark" ? "light" : "dark";
      this.applyTheme(nextTheme);
      this.showToast(`Switched to ${nextTheme} theme`);
    }
    bindThemeToggle() {
      const btn = document.getElementById("theme-toggle-btn");
      if (btn) {
        btn.addEventListener("click", () => this.toggleTheme());
      }
    }
    // View Navigation
    switchView(viewName) {
      if (!Object.values(VIEWS).includes(viewName)) return;
      this.currentView = viewName;
      document.querySelectorAll(".sidebar-nav .nav-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.view === viewName);
      });
      document.querySelectorAll(".view-section").forEach((sec) => {
        sec.classList.toggle("active", sec.id === `view-${viewName}`);
      });
      const viewTitle = document.getElementById("current-view-title");
      if (viewTitle) {
        const titles = {
          [VIEWS.HOME]: "Workspace Overview",
          [VIEWS.KANBAN]: "Kanban Board",
          [VIEWS.SPRINT]: "Sprint Planner",
          [VIEWS.POMODORO]: "Pomodoro Timer",
          [VIEWS.ANALYTICS]: "Analytics & Velocity",
          [VIEWS.SETTINGS]: "Settings & Backup"
        };
        viewTitle.textContent = titles[viewName] || viewName;
      }
    }
    bindNavigation() {
      document.querySelectorAll(".sidebar-nav .nav-item").forEach((item) => {
        item.addEventListener("click", () => {
          const view = item.dataset.view;
          if (view) this.switchView(view);
        });
      });
    }
    // Dialog Light-Dismiss Fallbacks (per modern-web-guidance)
    bindDialogFallbacks() {
      document.querySelectorAll("dialog.modal-dialog").forEach((dialog) => {
        if (!("closedBy" in HTMLDialogElement.prototype)) {
          dialog.addEventListener("click", (event) => {
            if (event.target !== dialog) return;
            const rect = dialog.getBoundingClientRect();
            const isDialogContent = rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
            if (!isDialogContent) dialog.close();
          });
        }
      });
    }
    // Shortcuts Modal
    bindShortcutsModal() {
      const shortcutsBtn = document.getElementById("shortcuts-btn");
      const shortcutsModal = document.getElementById("shortcuts-modal");
      const closeBtn = document.getElementById("btn-close-shortcuts-modal");
      if (shortcutsBtn && shortcutsModal) {
        shortcutsBtn.addEventListener("click", () => shortcutsModal.showModal());
      }
      if (closeBtn && shortcutsModal) {
        closeBtn.addEventListener("click", () => shortcutsModal.close());
      }
    }
    // Global Shortcuts
    bindGlobalShortcuts() {
      window.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
          if (e.key === "Escape") e.target.blur();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          const searchInput = document.getElementById("global-search-input");
          if (searchInput) searchInput.focus();
        } else if (e.key === "?") {
          e.preventDefault();
          const modal = document.getElementById("shortcuts-modal");
          if (modal) modal.showModal();
        } else if (e.key.toLowerCase() === "n") {
          e.preventDefault();
          taskModal.openNew();
        } else if (e.key === "0" || e.key.toLowerCase() === "h") {
          this.switchView(VIEWS.HOME);
        } else if (e.key === "1") {
          this.switchView(VIEWS.KANBAN);
        } else if (e.key === "2") {
          this.switchView(VIEWS.SPRINT);
        } else if (e.key === "3") {
          this.switchView(VIEWS.POMODORO);
        } else if (e.key === "4") {
          this.switchView(VIEWS.ANALYTICS);
        }
      });
    }
    // Toast System
    showToast(message, type = "info") {
      const container = document.getElementById("toast-container");
      if (!container) return;
      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `<span>\u26A1</span><span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }, 3e3);
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    window.TaskForge = new TaskForgeApp();
  });
})();
