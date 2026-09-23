# 💡 Unlocked Concept #12: Composite B-Tree Indexes & Leftmost Prefix

**Category:** `Database & DevOps`  
**Unlocked At:** 2026-09-23 22:25  
**Reward:** `+25 XP`  

---

### 📖 Summary
Understanding multi-column indexes: an index on (A, B, C) can satisfy queries on A, (A,B), and (A,B,C).

---

### 💻 Code Implementation
```python
-- Efficient: Uses composite index
CREATE INDEX idx_user_status_created ON users (status, created_at);

-- FAST: Matches leftmost prefix:
SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC;

-- SLOW (Full scan): Does not specify 'status':
SELECT * FROM users WHERE created_at > '2026-01-01';
```

---

### 🎯 Key Takeaway
> **"A query filtering only on B or C CANNOT use the index (A, B, C) efficiently."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
