# 💡 Unlocked Concept #6: Circuit Breaker Pattern

**Category:** `Architecture`  
**Unlocked At:** 2026-09-22 00:18  
**Reward:** `+25 XP`  

---

### 📖 Summary
Prevents catastrophic cascading failures when a downstream microservice is degraded or down.

---

### 💻 Code Implementation
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_time=60):
        self.state = "CLOSED"
        self.failures = 0
        self.threshold = failure_threshold
        
    def call(self, service_fn, *args):
        if self.state == "OPEN":
            raise Exception("Circuit is OPEN: fallback activated immediately")
        try:
            return service_fn(*args)
        except Exception as err:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "OPEN"
            raise err
```

---

### 🎯 Key Takeaway
> **"Transition states: Closed (healthy) -> Open (failing fast) -> Half-Open (probing)."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
