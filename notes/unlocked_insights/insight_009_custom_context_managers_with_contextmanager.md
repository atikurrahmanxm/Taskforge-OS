# 💡 Unlocked Concept #9: Custom Context Managers with `@contextmanager`

**Category:** `Python Mastery`  
**Unlocked At:** 2026-09-23 19:16  
**Reward:** `+25 XP`  

---

### 📖 Summary
Safely manages resource acquisition and cleanup (files, locks, DB transactions) cleanly.

---

### 💻 Code Implementation
```python
from contextlib import contextmanager
import time

@contextmanager
def execution_timer(task_name):
    start = time.perf_counter()
    try:
        yield
    finally:
        duration = time.perf_counter() - start
        print(f"[{task_name}] took {duration:.4f} seconds")

# Usage:
with execution_timer("Matrix computation"):
    # Run heavy operations here
    sum(i * i for i in range(1000000))
```

---

### 🎯 Key Takeaway
> **"Everything before `yield` is setup; everything after is guaranteed teardown in `finally`."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
