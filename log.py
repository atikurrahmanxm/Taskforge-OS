#!/usr/bin/env python3
"""
DevLog Hub - Daily Learning Tracker & Git Contribution Automator
Author: You
Description: Easily record daily learning, manage tasks, update your streak,
             and push commits to your private GitHub repository in seconds.
"""

import os
import sys
import json
import datetime
import subprocess
import argparse

# Enable UTF-8 encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
PROFILE_FILE = os.path.join(DATA_DIR, "profile.json")
TASKS_FILE = os.path.join(DATA_DIR, "tasks.json")
LOGS_FILE = os.path.join(DATA_DIR, "logs.json")
SNIPPETS_FILE = os.path.join(BASE_DIR, "snippets", "useful_snippets.md")
NOTES_DIR = os.path.join(BASE_DIR, "notes")


def load_json(filepath, default):
    if not os.path.exists(filepath):
        return default
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(filepath, data):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def run_git_cmd(args):
    try:
        res = subprocess.run(["git"] + args, cwd=BASE_DIR, capture_output=True, text=True)
        return res.returncode == 0, res.stdout.strip(), res.stderr.strip()
    except FileNotFoundError:
        return False, "", "Git is not installed or not found in PATH."


def update_profile_streak():
    profile = load_json(PROFILE_FILE, {})
    today_str = datetime.date.today().isoformat()
    last_active = profile.get("lastActiveDate")

    if last_active != today_str:
        if last_active:
            try:
                last_dt = datetime.date.fromisoformat(last_active)
                delta = (datetime.date.today() - last_dt).days
                if delta == 1:
                    profile["currentStreak"] = profile.get("currentStreak", 0) + 1
                elif delta > 1:
                    profile["currentStreak"] = 1
            except Exception:
                profile["currentStreak"] = 1
        else:
            profile["currentStreak"] = 1

        profile["lastActiveDate"] = today_str

    profile["totalContributions"] = profile.get("totalContributions", 0) + 1
    if profile.get("currentStreak", 1) > profile.get("bestStreak", 1):
        profile["bestStreak"] = profile["currentStreak"]

    save_json(PROFILE_FILE, profile)
    return profile


def git_commit_and_push(commit_msg):
    print("\n📦 Staging changes...")
    ok, out, err = run_git_cmd(["add", "."])
    if not ok:
        print(f"❌ git add failed: {err}")
        return False

    print(f"📝 Committing with message: \"{commit_msg}\"")
    ok, out, err = run_git_cmd(["commit", "-m", commit_msg])
    if not ok:
        if "nothing to commit" in err or "nothing to commit" in out:
            print("ℹ️ Nothing new to commit (workspace clean).")
        else:
            print(f"❌ git commit failed: {err}")
            return False
    else:
        print("✅ Committed successfully!")

    print("🚀 Pushing to remote GitHub repository...")
    ok, out, err = run_git_cmd(["push", "origin", "main"])
    if not ok:
        # Check if remote exists
        ok_rem, out_rem, _ = run_git_cmd(["remote", "-v"])
        if not out_rem:
            print("⚠️ Remote origin not configured yet!")
            print("   Please link your GitHub repo first:")
            print("   git remote add origin https://github.com/<your-username>/<repo-name>.git")
            print("   git branch -M main")
            print("   git push -u origin main")
        else:
            print(f"⚠️ Push warning/error: {err}")
            print("   Tip: Make sure you've created the repo on GitHub and have push permissions.")
    else:
        print("🎉 Push successful! GitHub contribution graph updated!")
    return True


def action_quick_log():
    print("\n--- 📖 Log Today's Learning / Activity ---")
    sessions = ["Session 1 (Morning)", "Session 2 (Mid-Day)", "Session 3 (Afternoon)", "Session 4 (Night)"]
    print("Select Session:")
    for idx, s in enumerate(sessions, 1):
        print(f"  {idx}. {s}")
    
    sess_choice = input("Enter number (1-4, default 2): ").strip()
    session_name = sessions[int(sess_choice) - 1] if sess_choice in ["1", "2", "3", "4"] else sessions[1]

    topic = input("Topic/Subject (e.g., Python OOP, LeetCode Array): ").strip() or "Daily Progress"
    summary = input("Short summary of what you did: ").strip() or "Practiced coding and reviewed core concepts."
    raw_tags = input("Tags (comma-separated, e.g. python, dsa, git): ").strip()
    tags = [t.strip().lower() for t in raw_tags.split(",")] if raw_tags else ["learning"]

    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    logs = load_json(LOGS_FILE, [])
    log_id = f"log-{len(logs) + 1:03d}"

    new_entry = {
        "id": log_id,
        "timestamp": now,
        "session": session_name,
        "topic": topic,
        "summary": summary,
        "tags": tags
    }
    logs.insert(0, new_entry)
    save_json(LOGS_FILE, logs)

    # Update profile stats
    profile = update_profile_streak()
    stats = profile.setdefault("stats", {})
    stats["notesLogged"] = stats.get("notesLogged", 0) + 1
    save_json(PROFILE_FILE, profile)

    print(f"✅ Log added: [{topic}] ({now})")

    auto_push = input("\n👉 Commit and push to GitHub now? (Y/n): ").strip().lower()
    if auto_push != "n":
        msg = f"feat(log): {session_name} - {topic} [{now}]"
        git_commit_and_push(msg)


def action_manage_tasks():
    print("\n--- ✅ Manage Daily Tasks ---")
    tasks = load_json(TASKS_FILE, [])
    if not tasks:
        print("No tasks found.")
        return

    print("\nCurrent Tasks:")
    for idx, t in enumerate(tasks, 1):
        status = "✔ [DONE]" if t.get("completed") else "⏳ [TODO]"
        print(f"  {idx}. {status} {t['title']} ({t.get('pushSession', 'Daily')})")

    print("\nOptions: [1-N] Toggle complete, [A] Add new task, [B] Back")
    choice = input("Choice: ").strip().lower()

    if choice == "a":
        new_title = input("Task title: ").strip()
        if new_title:
            new_id = max([t.get("id", 0) for t in tasks] or [0]) + 1
            sess = input("Session tag (e.g. Session 1 / Session 2): ").strip() or "Daily"
            tasks.append({
                "id": new_id,
                "title": new_title,
                "category": "Custom",
                "completed": False,
                "pushSession": sess,
                "completedAt": None
            })
            save_json(TASKS_FILE, tasks)
            print("✅ Task added!")
            commit_now = input("👉 Commit & push update? (y/N): ").strip().lower()
            if commit_now == "y":
                update_profile_streak()
                git_commit_and_push(f"task: add new task '{new_title}'")
    elif choice.isdigit():
        idx = int(choice) - 1
        if 0 <= idx < len(tasks):
            t = tasks[idx]
            t["completed"] = not t.get("completed", False)
            if t["completed"]:
                t["completedAt"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                print(f"🎉 Marked as DONE: {t['title']}")
                profile = update_profile_streak()
                profile.setdefault("stats", {})["tasksCompleted"] = profile["stats"].get("tasksCompleted", 0) + 1
                save_json(PROFILE_FILE, profile)
            else:
                t["completedAt"] = None
                print(f"↩️ Marked as pending: {t['title']}")
            save_json(TASKS_FILE, tasks)

            commit_now = input("👉 Commit & push update? (Y/n): ").strip().lower()
            if commit_now != "n":
                status_str = "complete" if t["completed"] else "reopen"
                git_commit_and_push(f"task({status_str}): {t['title']}")


def action_add_snippet():
    print("\n--- 💡 Add Code Snippet to Vault ---")
    title = input("Snippet Title (e.g. Binary Search in Python): ").strip()
    if not title:
        print("Canceled.")
        return
    lang = input("Language (python, js, etc.): ").strip() or "text"
    print("Enter code (Enter END on a new line to finish):")
    lines = []
    while True:
        line = input()
        if line.strip() == "END":
            break
        lines.append(line)
    code = "\n".join(lines)

    snippet_entry = f"\n\n---\n\n### {title}\n```{lang}\n{code}\n```\n"
    with open(SNIPPETS_FILE, "a", encoding="utf-8") as f:
        f.write(snippet_entry)

    profile = update_profile_streak()
    profile.setdefault("stats", {})["snippetsSaved"] = profile["stats"].get("snippetsSaved", 0) + 1
    save_json(PROFILE_FILE, profile)
    print("✅ Snippet saved in snippets/useful_snippets.md!")

    commit_now = input("👉 Commit & push snippet? (Y/n): ").strip().lower()
    if commit_now != "n":
        now = datetime.datetime.now().strftime("%Y-%m-%d")
        git_commit_and_push(f"snippet(add): {title} [{now}]")


def action_instant_push():
    print("\n--- ⚡ Instant Commit & Push ---")
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    default_msg = f"chore(pulse): regular daily contribution sync [{now}]"
    custom_msg = input(f"Commit message [Default: {default_msg}]: ").strip()
    msg = custom_msg if custom_msg else default_msg
    update_profile_streak()
    git_commit_and_push(msg)


def show_summary():
    profile = load_json(PROFILE_FILE, {})
    tasks = load_json(TASKS_FILE, [])
    logs = load_json(LOGS_FILE, [])

    done_tasks = sum(1 for t in tasks if t.get("completed"))
    print("\n" + "=" * 50)
    print("  🔥 DevLog Hub - Daily GitHub Contribution Assistant 🔥")
    print("=" * 50)
    print(f"  Streak:              {profile.get('currentStreak', 1)} day(s) (Best: {profile.get('bestStreak', 1)})")
    print(f"  Total Contributions: {profile.get('totalContributions', 1)}")
    print(f"  Daily Push Goal:     {profile.get('dailyTargetPushes', 4)} per day")
    print(f"  Tasks Progress:      {done_tasks}/{len(tasks)} completed")
    print(f"  Total Logs:          {len(logs)} recorded")
    print("=" * 50)


def main():
    parser = argparse.ArgumentParser(description="DevLog Hub Contribution Tool")
    parser.add_argument("--push", type=str, help="Instantly commit and push with custom message")
    parser.add_argument("--quick", action="store_true", help="Quick automatic commit & push with timestamp")
    parser.add_argument("--status", action="store_true", help="Show current streak & stats")
    args = parser.parse_args()

    if args.push:
        update_profile_streak()
        git_commit_and_push(args.push)
        return
    if args.quick:
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        update_profile_streak()
        git_commit_and_push(f"chore(pulse): automatic sync update [{now}]")
        return
    if args.status:
        show_summary()
        return

    while True:
        show_summary()
        print("\nSelect an action:")
        print("  1. 📖 Log Today's Learning / Study Note (Push option)")
        print("  2. ✅ Complete / Add Daily Task (Push option)")
        print("  3. 💡 Add Code Snippet to Vault (Push option)")
        print("  4. ⚡ Instant 1-Click Commit & Push")
        print("  5. 🌐 Open Dashboard in Browser (index.html)")
        print("  0. 🚪 Exit")

        choice = input("\nEnter choice [0-5]: ").strip()
        if choice == "1":
            action_quick_log()
        elif choice == "2":
            action_manage_tasks()
        elif choice == "3":
            action_add_snippet()
        elif choice == "4":
            action_instant_push()
        elif choice == "5":
            html_path = os.path.join(BASE_DIR, "index.html")
            try:
                import webbrowser
                webbrowser.open(f"file://{html_path}")
                print(f"Opened {html_path} in browser!")
            except Exception as e:
                print(f"Could not open browser: {e}")
        elif choice == "0":
            print("Happy coding! Keep your streak green! 🌿")
            break
        else:
            print("Invalid choice, please select 0 to 5.")


if __name__ == "__main__":
    main()
