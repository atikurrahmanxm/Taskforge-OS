# 💡 Unlocked Concept #5: Sliding Window Pattern

**Category:** `Algorithms`  
**Unlocked At:** 2026-09-22 00:17  
**Reward:** `+25 XP`  

---

### 📖 Summary
Maintains a running window over an array to solve sub-array problems in linear O(n) time.

---

### 💻 Code Implementation
```python
def max_sub_array_of_size_k(k, arr):
    max_sum, window_sum, window_start = 0, 0, 0
    for window_end in range(len(arr)):
        window_sum += arr[window_end]
        if window_end >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[window_start]
            window_start += 1
    return max_sum
```

---

### 🎯 Key Takeaway
> **"Keep track of window state dynamically instead of recalculating from scratch on each shift."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
