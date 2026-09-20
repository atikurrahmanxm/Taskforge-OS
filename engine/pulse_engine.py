#!/usr/bin/env python3
"""
DevLog Hub - Pulse Evolution Engine
Runs on every push: awards XP, unlocks dev knowledge, levels up your developer rank,
and writes new notes and code snippets automatically.
"""

import os
import sys
import json
import datetime
import argparse
import re

# Enable UTF-8 encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ENGINE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(ENGINE_DIR)
DATA_DIR = os.path.join(BASE_DIR, "data")
NOTES_DIR = os.path.join(BASE_DIR, "notes", "unlocked_insights")
PROFILE_FILE = os.path.join(DATA_DIR, "profile.json")
INSIGHTS_FILE = os.path.join(DATA_DIR, "insights.json")
LOGS_FILE = os.path.join(DATA_DIR, "logs.json")

# Import knowledge pool
sys.path.insert(0, ENGINE_DIR)
from knowledge_pool import KNOWLEDGE_POOL


def load_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def calculate_level_info(xp):
    levels = [
        (0, 99, 1, "Terminal Novice"),
        (100, 249, 2, "Code Crafter"),
        (250, 499, 3, "Logic Architect"),
        (500, 999, 4, "Full-Stack Wizard"),
        (1000, 999999, 5, "System Overlord")
    ]
    for min_xp, max_xp, lvl, title in levels:
        if min_xp <= xp <= max_xp:
            next_level_xp = max_xp + 1
            progress_in_lvl = xp - min_xp
            total_in_lvl = next_level_xp - min_xp
            pct = min(100, int((progress_in_lvl / total_in_lvl) * 100))
            return lvl, title, next_level_xp, pct
    return 5, "System Overlord", 999999, 100


def check_badges(profile, unlocked_count):
    badges = profile.get("badges", [])
    badge_ids = {b["id"] for b in badges}
    
    newly_awarded = []
    
    # Badge: Genesis
    if "genesis" not in badge_ids and profile.get("totalContributions", 0) >= 1:
        b = {"id": "genesis", "icon": "🌱", "name": "Genesis Pulse", "desc": "First push into the project"}
        badges.append(b)
        newly_awarded.append(b)

    # Badge: Daily Sprint (4 pushes)
    if "sprint_master" not in badge_ids and profile.get("todayPushes", 0) >= 4:
        b = {"id": "sprint_master", "icon": "⚡", "name": "Sprint Master", "desc": "Completed 4 pulses in a single day"}
        badges.append(b)
        newly_awarded.append(b)

    # Badge: Knowledge Hoarder
    if "knowledge_vault" not in badge_ids and unlocked_count >= 5:
        b = {"id": "knowledge_vault", "icon": "📚", "name": "Knowledge Hoarder", "desc": "Unlocked 5+ core dev concepts"}
        badges.append(b)
        newly_awarded.append(b)

    # Badge: Level 2 Reached
    if "level_2" not in badge_ids and profile.get("level", 1) >= 2:
        b = {"id": "level_2", "icon": "🛠️", "name": "Code Crafter", "desc": "Reached Developer Level 2"}
        badges.append(b)
        newly_awarded.append(b)

    profile["badges"] = badges
    return newly_awarded


def trigger_pulse():
    os.makedirs(NOTES_DIR, exist_ok=True)
    
    # 1. Load data
    profile = load_json(PROFILE_FILE, {})
    insights = load_json(INSIGHTS_FILE, [])
    logs = load_json(LOGS_FILE, [])

    today_str = datetime.date.today().isoformat()
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    # 2. Daily push tracking
    last_date = profile.get("lastActiveDate")
    if last_date != today_str:
        profile["todayPushes"] = 1
        # Update streak
        if last_date:
            try:
                last_dt = datetime.date.fromisoformat(last_date)
                delta = (datetime.date.today() - last_dt).days
                if delta == 1:
                    profile["currentStreak"] = profile.get("currentStreak", 1) + 1
                elif delta > 1:
                    profile["currentStreak"] = 1
            except Exception:
                profile["currentStreak"] = 1
        else:
            profile["currentStreak"] = 1
        profile["lastActiveDate"] = today_str
    else:
        profile["todayPushes"] = profile.get("todayPushes", 0) + 1

    profile["totalContributions"] = profile.get("totalContributions", 0) + 1
    if profile.get("currentStreak", 1) > profile.get("bestStreak", 1):
        profile["bestStreak"] = profile["currentStreak"]

    # 3. Award XP & Level
    current_xp = profile.get("xp", 0) + 25
    profile["xp"] = current_xp
    lvl, title, next_xp, pct = calculate_level_info(current_xp)
    old_lvl = profile.get("level", 1)
    profile["level"] = lvl
    profile["rankTitle"] = title

    # 4. Pick next knowledge item to unlock
    unlocked_ids = {item["id"] for item in insights}
    available = [item for item in KNOWLEDGE_POOL if item["id"] not in unlocked_ids]
    if not available:
        # Loop over pool if all unlocked
        available = KNOWLEDGE_POOL
    
    chosen = available[0]
    
    # 5. Save markdown note
    slug = re.sub(r'[^a-zA-Z0-9]+', '_', chosen['title'].lower()).strip('_')
    md_filename = f"insight_{chosen['id']:03d}_{slug}.md"
    md_path = os.path.join(NOTES_DIR, md_filename)
    
    md_content = f"""# 💡 Unlocked Concept #{chosen['id']}: {chosen['title']}

**Category:** `{chosen['category']}`  
**Unlocked At:** {now_str}  
**Reward:** `+25 XP`  

---

### 📖 Summary
{chosen['summary']}

---

### 💻 Code Implementation
```python
{chosen['code']}
```

---

### 🎯 Key Takeaway
> **"{chosen['takeaway']}"**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
"""
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    # 6. Save insight metadata
    insight_record = {
        "id": chosen["id"],
        "title": chosen["title"],
        "category": chosen["category"],
        "summary": chosen["summary"],
        "takeaway": chosen["takeaway"],
        "file": f"notes/unlocked_insights/{md_filename}",
        "unlockedAt": now_str,
        "xpAwarded": 25
    }
    insights.insert(0, insight_record)
    save_json(INSIGHTS_FILE, insights)

    # 7. Check badges
    new_badges = check_badges(profile, len(insights))
    save_json(PROFILE_FILE, profile)

    # 8. Add structured log
    log_entry = {
        "id": f"pulse-{profile['totalContributions']:03d}",
        "timestamp": now_str,
        "session": f"Pulse #{profile['todayPushes']} Today",
        "topic": f"Unlocked: {chosen['title']}",
        "summary": f"{chosen['summary']} (+25 XP gained)",
        "tags": [chosen['category'].lower(), "auto-pulse", f"lvl-{lvl}"]
    }
    logs.insert(0, log_entry)
    save_json(LOGS_FILE, logs)

    # 9. Formulate smart commit message
    commit_msg = f"{chosen['commit_tag']} | +25 XP [Lvl {lvl}]"

    return {
        "chosen": chosen,
        "xp": current_xp,
        "level": lvl,
        "rankTitle": title,
        "pct": pct,
        "next_xp": next_xp,
        "streak": profile["currentStreak"],
        "todayPushes": profile["todayPushes"],
        "new_badges": new_badges,
        "level_up": (lvl > old_lvl),
        "commit_msg": commit_msg,
        "md_file": md_filename
    }


def main():
    parser = argparse.ArgumentParser(description="Pulse Evolution Engine")
    parser.add_argument("--commit-msg-only", action="store_true", help="Print only the suggested commit message")
    parser.add_argument("--run", action="store_true", help="Trigger an automated progression pulse")
    args = parser.parse_args()

    if args.run or len(sys.argv) == 1:
        res = trigger_pulse()
        
        print("\n" + "=" * 58)
        print("   🌟  P R O J E C T   E V O L U T I O N   P U L S E  🌟")
        print("=" * 58)
        print(f"  📖 Unlocked:      #{res['chosen']['id']} - {res['chosen']['title']}")
        print(f"  🏷️  Category:      {res['chosen']['category']}")
        print(f"  ⚡ XP Gained:      +25 XP (Total: {res['xp']} XP)")
        print(f"  🎖️  Rank & Level:  Level {res['level']} - {res['rankTitle']} [{res['pct']}%]")
        print(f"  🔥 Streak:        {res['streak']} Day(s) ({res['todayPushes']}/4 pushes today)")
        print(f"  📝 Saved to:      notes/unlocked_insights/{res['md_file']}")
        
        if res['level_up']:
            print(f"\n  🎉 LEVEL UP! You reached Level {res['level']} ({res['rankTitle']})! 🎉")
            
        for b in res['new_badges']:
            print(f"  🏆 NEW TROPHY UNLOCKED: {b['icon']} {b['name']} - {b['desc']}")

        print("=" * 58)
        print(f"  💡 Suggested Commit: \"{res['commit_msg']}\"")
        print("=" * 58 + "\n")
        
        # Write commit message to temp file for quick-push.bat to read reliably
        commit_cache_file = os.path.join(DATA_DIR, ".last_commit_msg")
        try:
            with open(commit_cache_file, "w", encoding="utf-8") as f:
                f.write(res["commit_msg"])
        except Exception:
            pass
        return


if __name__ == "__main__":
    main()
