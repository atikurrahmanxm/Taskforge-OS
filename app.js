// DevLog Hub - Dashboard Logic with Auto-Evolution Integration
document.addEventListener("DOMContentLoaded", () => {
  // Fallbacks in case running directly from local file://
  const defaultProfile = {
    username: "Developer",
    goal: "Consistent Daily Contributions & Learning",
    dailyTargetPushes: 4,
    currentStreak: 1,
    todayPushes: 1,
    totalContributions: 2,
    xp: 25,
    level: 1,
    rankTitle: "Terminal Novice",
    badges: [
      { id: "genesis", icon: "🌱", name: "Genesis Pulse", desc: "First push into the project" }
    ]
  };

  const defaultTasks = [
    { id: 1, title: "Morning roadmap & daily goals review", session: "Session 1", completed: true },
    { id: 2, title: "Read 1 article / chapter on algorithms or system design", session: "Session 2", completed: true },
    { id: 3, title: "Implement or optimize a practice code snippet", session: "Session 3", completed: false },
    { id: 4, title: "Evening wrap-up, commit review, and reflection", session: "Session 4", completed: false }
  ];

  const defaultInsights = [
    {
      id: 1,
      title: "Two-Pointer Technique",
      category: "Algorithms",
      summary: "Optimizes searching pairs in sorted arrays from O(n^2) to O(n) by using two pointers moving inward.",
      takeaway: "Always sort first or verify sorting before applying the two-pointer collision strategy.",
      unlockedAt: "2026-09-21 01:39",
      code: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []`
    }
  ];

  const defaultLogs = [
    {
      id: "pulse-001",
      topic: "Unlocked: Two-Pointer Technique",
      timestamp: "2026-09-21 01:39",
      summary: "Optimizes searching pairs in sorted arrays from O(n^2) to O(n) (+25 XP gained)",
      tags: ["algorithms", "auto-pulse", "lvl-1"]
    }
  ];

  let profile = JSON.parse(localStorage.getItem("devlog_profile")) || defaultProfile;
  let tasks = JSON.parse(localStorage.getItem("devlog_tasks")) || defaultTasks;
  let insights = JSON.parse(localStorage.getItem("devlog_insights")) || defaultInsights;
  let logs = JSON.parse(localStorage.getItem("devlog_logs")) || defaultLogs;

  // Sync from backend JSON files
  async function syncFromFiles() {
    try {
      const pRes = await fetch("data/profile.json");
      if (pRes.ok) {
        const pData = await pRes.json();
        profile = { ...profile, ...pData };
      }
      const tRes = await fetch("data/tasks.json");
      if (tRes.ok) {
        tasks = await tRes.json();
      }
      const iRes = await fetch("data/insights.json");
      if (iRes.ok) {
        insights = await iRes.json();
      }
      const lRes = await fetch("data/logs.json");
      if (lRes.ok) {
        logs = await lRes.json();
      }
    } catch {
      // Running from file:// protocol without local HTTP server
    }
    saveAndRender();
  }

  function saveAndRender() {
    localStorage.setItem("devlog_profile", JSON.stringify(profile));
    localStorage.setItem("devlog_tasks", JSON.stringify(tasks));
    localStorage.setItem("devlog_insights", JSON.stringify(insights));
    localStorage.setItem("devlog_logs", JSON.stringify(logs));

    renderXPAndHeader();
    renderBadges();
    renderInsights();
    renderTasks();
    renderLogs();
    renderContribGrid();
  }

  // Render Header & XP Progress
  function renderXPAndHeader() {
    const xp = profile.xp || 25;
    const lvl = profile.level || 1;
    const rankTitle = profile.rankTitle || "Terminal Novice";

    // Level calculation
    const levels = [
      [0, 99, 1],
      [100, 249, 2],
      [250, 499, 3],
      [500, 999, 4],
      [1000, 999999, 5]
    ];
    let nextXP = 100;
    let minXP = 0;
    for (const [minX, maxX, l] of levels) {
      if (xp >= minX && xp <= maxX) {
        minXP = minX;
        nextXP = maxX + 1;
        break;
      }
    }

    const pct = Math.min(100, Math.round(((xp - minXP) / (nextXP - minXP)) * 100));

    // Elements
    document.getElementById("streak-count").textContent = profile.currentStreak || 1;
    document.getElementById("today-pushes").textContent = profile.todayPushes || 1;
    document.getElementById("rank-badge").textContent = `🎖️ Level ${lvl}`;
    document.getElementById("rank-title").textContent = rankTitle;
    document.getElementById("current-xp").textContent = xp;
    document.getElementById("next-xp").textContent = nextXP;
    document.getElementById("xp-progress-fill").style.width = `${pct}%`;
    document.getElementById("xp-percentage-text").textContent = `${pct}% towards Level ${lvl + 1}`;
  }

  // Render Badges
  function renderBadges() {
    const rack = document.getElementById("badges-rack");
    rack.innerHTML = "";

    const badges = profile.badges && profile.badges.length > 0 ? profile.badges : [
      { id: "genesis", icon: "🌱", name: "Genesis Pulse", desc: "First push into the project" }
    ];

    badges.forEach(b => {
      const div = document.createElement("div");
      div.className = "badge-item";
      div.innerHTML = `
        <span class="badge-icon">${b.icon}</span>
        <div>
          <div class="badge-name">${escapeHtml(b.name)}</div>
          <div class="badge-desc">${escapeHtml(b.desc)}</div>
        </div>
      `;
      rack.appendChild(div);
    });
  }

  // Render Insights
  function renderInsights() {
    const container = document.getElementById("insights-container");
    container.innerHTML = "";

    const countBadge = document.getElementById("unlocked-count-badge");
    if (countBadge) {
      countBadge.textContent = `${insights.length} Unlocked`;
    }

    if (insights.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Run quick-push.bat to unlock your first concept!</p>`;
      return;
    }

    insights.slice(0, 4).forEach(item => {
      const card = document.createElement("div");
      card.className = "insight-card";
      card.innerHTML = `
        <div class="insight-top">
          <span class="insight-badge">#${item.id} • ${escapeHtml(item.category)}</span>
          <span class="insight-time">⚡ +25 XP</span>
        </div>
        <h3 class="insight-title">${escapeHtml(item.title)}</h3>
        <p class="insight-summary">${escapeHtml(item.summary)}</p>
        <div class="insight-takeaway">💡 Takeaway: ${escapeHtml(item.takeaway)}</div>
        ${item.code ? `
          <div class="insight-code-wrap">
            <pre class="insight-code"><code>${escapeHtml(item.code)}</code></pre>
          </div>
        ` : ""}
      `;
      container.appendChild(card);
    });
  }

  // Render Tasks
  function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    const completedCount = tasks.filter(t => t.completed).length;
    document.getElementById("task-stats-text").textContent = `${completedCount} / ${tasks.length} Done`;

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

    // Checkbox and label click
    taskList.querySelectorAll(".task-checkbox, .task-label").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "span" || e.target.tagName.toLowerCase() === "input") {
          const id = parseInt(e.target.getAttribute("data-id"));
          const task = tasks.find(item => item.id === id);
          if (task) {
            task.completed = !task.completed;
            showToast(task.completed ? "Task completed! Run quick-push.bat to sync." : "Task reopened.");
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
    showToast("Goal added! Double-click quick-push.bat to push.");
  });

  // Render Logs
  function renderLogs() {
    const logsList = document.getElementById("logs-list");
    logsList.innerHTML = "";

    logs.slice(0, 5).forEach(log => {
      const entry = document.createElement("div");
      entry.className = "log-entry";
      entry.innerHTML = `
        <div class="log-entry-header">
          <span class="log-title">${escapeHtml(log.topic)}</span>
          <span class="log-time">${escapeHtml(log.timestamp)}</span>
        </div>
        <p class="log-summary">${escapeHtml(log.summary)}</p>
      `;
      logsList.appendChild(entry);
    });
  }

  // Render simulated GitHub Contribution squares
  function renderContribGrid() {
    const grid = document.getElementById("contrib-grid");
    grid.innerHTML = "";

    for (let i = 0; i < 70; i++) {
      const cell = document.createElement("div");
      let lvl = 0;
      if (i > 58) {
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
          prompt("Copy this command:", cmd);
        });
      }
    }
  });

  // Refresh / Sync button
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
