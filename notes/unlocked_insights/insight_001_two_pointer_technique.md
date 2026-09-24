# 💡 Unlocked Concept #1: Two-Pointer Technique

**Category:** `Algorithms`  
**Unlocked At:** 2026-09-25 00:06  
**Reward:** `+25 XP`  

---

### 📖 Summary
Optimizes searching pairs in sorted arrays from O(n^2) to O(n) by using two pointers moving inward.

---

### 💻 Code Implementation
```python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []
```

---

### 🎯 Key Takeaway
> **"Always sort first or verify sorting before applying the two-pointer collision strategy."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
