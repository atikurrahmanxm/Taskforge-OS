# 💡 Unlocked Concept #14: Rate Limiting with Token Bucket

**Category:** `System Design`  
**Unlocked At:** 2026-09-23 22:27  
**Reward:** `+25 XP`  

---

### 📖 Summary
Allows smooth bursts of traffic while enforcing a strict steady-state average rate limit.

---

### 💻 Code Implementation
```python
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate_per_sec):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = capacity
        self.last_refill = time.time()
        
    def allow_request(self, tokens=1):
        now = time.time()
        # Add tokens accumulated since last call:
        self.tokens = min(self.capacity, self.tokens + (now - self.last_refill) * self.refill_rate)
        self.last_refill = now
        
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
```

---

### 🎯 Key Takeaway
> **"Refill tokens lazily based on elapsed time rather than running a background timer tick."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
