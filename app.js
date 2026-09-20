// DevLog Hub - Dashboard Logic
document.addEventListener("DOMContentLoaded", () => {
  // Initial fallback states
  const defaultProfile = {
    username: "Developer",
    goal: "Consistent Daily Contributions & Learning",
    dailyTargetPushes: 4,
    currentStreak: 1,
    todayPushes: 2,
    totalContributions: 14
  };

  const defaultTasks = [
    { id: 1, title: "Morning roadmap & daily goals review", session: "Session 1", completed: true },
    { id: 2, title: "Read 1 article / chapter on algorithms or system design", session: "Session 2", completed: true },
    { id: 3, title: "Implement or optimize a practice code snippet", session: "Session 3", completed: false },
    { id: 4, title: "Evening wrap-up, commit review, and reflection", session: "Session 4", completed: false }
  ];

  const defaultLogs = [
    {
      id: "log-001",
      topic: "Initialized DevLog Hub for GitHub Growth",
      timestamp: "2026-09-21 01:25",
      summary: "Set up the private repository, dashboard, and daily contribution routine.",
      tags: ["git", "setup", "habits"]
    },
    {
      id: "log-002",
      topic: "Configured 4-Push Daily Blueprint",
      timestamp: "2026-09-21 01:30",
      summary: "Created automated python and batch scripts for 1-click commits.",
      tags: ["automation", "cli", "python"]
    }
  ];

  // Load from localStorage or defaults
  let profile = JSON.parse(localStorage.getItem("devlog_profile")) || defaultProfile;
  let tasks = JSON.parse(localStorage.getItem("devlog_tasks")) || defaultTasks;
  let logs = JSON.parse(localStorage.getItem("devlog_logs")) || defaultLogs;

  // Try fetching external JSON if served via HTTP
  async function syncFromFiles() {
    try {
      const pRes = await fetch("data/profile.json");
      if (pRes.ok) {
        const pData = await pRes.json();
        profile.currentStreak = pData.currentStreak || profile.currentStreak;
        profile.totalContributions = pData.totalContributions || profile.totalContributions;
      }
      const tRes = await fetch("data/tasks.json");
      if (tRes.ok) {
        tasks = await tRes.json();
      }
      const lRes = await fetch("data/logs.json");
      if (lRes.ok) {
        logs = await lRes.json();
      }
      saveAndRender();
    } catch {
      // Running from file:// protocol, using localStorage data
      saveAndRender();
    }
  }

  function saveAndRender() {
    localStorage.setItem("devlog_profile", JSON.stringify(profile));
    localStorage.setItem("devlog_tasks", JSON.stringify(tasks));
    localStorage.setItem("devlog_logs", JSON.stringify(logs));

    renderHeader();
    renderTasks();
    renderLogs();
    renderContribGrid();
  }

  // Render Header
  function renderHeader() {
    document.getElementById("streak-count").textContent = profile.currentStreak || 1;
    const completedCount = tasks.filter(t => t.completed).length;
    document.getElementById("today-pushes").textContent = completedCount;
  }

  // Render Tasks
  function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    const completedCount = tasks.filter(t => t.completed).length;
    document.getElementById("task-stats-text").textContent = `${completedCount} / ${tasks.length} Completed`;

    tasks.forEach(t => {
      const li = document.createElement("li");
      li.className = `task-item ${t.completed ? "completed" : ""}`;
      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" data-id="${t.id}" ${t.completed ? "checked" : ""}>
          <span class="task-label" data-id="${t.id}">${escapeHtml(t.title)}</span>
        </div>
        <div class="task-meta">
          <span class="task-session-tag">${escapeHtml(t.session || t.pushSession || "Daily")}</span>
          <button class="task-del-btn" data-id="${t.id}" title="Delete task">✖</button>
        </div>
      `;
      taskList.appendChild(li);
    });

    // Checkbox and label toggle
    taskList.querySelectorAll(".task-checkbox, .task-label").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "span" || e.target.tagName.toLowerCase() === "input") {
          const id = parseInt(e.target.getAttribute("data-id"));
          const task = tasks.find(item => item.id === id);
          if (task) {
            task.completed = !task.completed;
            showToast(task.completed ? "Task completed! Remember to push." : "Task reopened.");
            saveAndRender();
          }
        }
      });
    });

    // Delete task
    taskList.querySelectorAll(".task-del-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        tasks = tasks.filter(item => item.id !== id);
        saveAndRender();
        showToast("Task removed.");
      });
    });
  }

  // Add Task
  document.getElementById("add-task-btn").addEventListener("click", () => {
    const input = document.getElementById("new-task-input");
    const sessionSelect = document.getElementById("new-task-session");
    const title = input.value.trim();
    if (!title) return;

    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id || 0)) + 1 : 1;
    tasks.push({
      id: newId,
      title: title,
      session: sessionSelect.value,
      completed: false
    });

    input.value = "";
    saveAndRender();
    showToast("New task added! Run python log.py to push.");
  });

  // Render Logs
  function renderLogs() {
    const logsList = document.getElementById("logs-list");
    logsList.innerHTML = "";

    logs.slice(0, 6).forEach(log => {
      const entry = document.createElement("div");
      entry.className = "log-entry";
      const tagsHtml = (log.tags || []).map(tag => `<span class="log-tag">#${escapeHtml(tag)}</span>`).join("");

      entry.innerHTML = `
        <div class="log-entry-header">
          <span class="log-title">${escapeHtml(log.topic)}</span>
          <span class="log-time">${escapeHtml(log.timestamp)}</span>
        </div>
        <p class="log-summary">${escapeHtml(log.summary)}</p>
        <div class="log-tags">${tagsHtml}</div>
      `;
      logsList.appendChild(entry);
    });
  }

  // Quick Log Form
  document.getElementById("quick-log-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const topic = document.getElementById("log-topic").value.trim();
    const summary = document.getElementById("log-summary").value.trim();
    const rawTags = document.getElementById("log-tags").value.trim();
    if (!topic || !summary) return;

    const tags = rawTags ? rawTags.split(",").map(t => t.trim()) : ["general"];
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    logs.unshift({
      id: `log-${Date.now()}`,
      topic: topic,
      timestamp: timeStr,
      summary: summary,
      tags: tags
    });

    profile.totalContributions = (profile.totalContributions || 0) + 1;

    document.getElementById("log-topic").value = "";
    document.getElementById("log-summary").value = "";
    document.getElementById("log-tags").value = "";

    saveAndRender();
    showToast("Study log saved! Run 'quick-push.bat' to commit & push.");
  });

  // Render simulated GitHub Contribution squares
  function renderContribGrid() {
    const grid = document.getElementById("contrib-grid");
    grid.innerHTML = "";

    // Generate 14 columns x 5 rows = 70 days preview
    const levels = [0, 1, 2, 3, 4];
    for (let i = 0; i < 70; i++) {
      const cell = document.createElement("div");
      // Give recent days some green activity
      let lvl = 0;
      if (i > 50) {
        lvl = (i % 4) + 1;
      } else if (i % 3 === 0) {
        lvl = (i % 3) + 1;
      }
      cell.className = `contrib-cell level-${lvl}`;
      cell.title = `Activity level: ${lvl}`;
      grid.appendChild(cell);
    }
  }

  // Copy command buttons
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".copy-cmd-btn");
    if (target) {
      const cmd = target.getAttribute("data-cmd");
      if (cmd) {
        navigator.clipboard.writeText(cmd).then(() => {
          showToast(`Copied: ${cmd}`);
        }).catch(() => {
          // fallback
          prompt("Copy this command:", cmd);
        });
      }
    }
  });

  // Refresh button
  document.getElementById("refresh-btn").addEventListener("click", () => {
    syncFromFiles();
    showToast("Dashboard synchronized!");
  });

  // Toast utility
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Initial load
  syncFromFiles();
});
