# 💡 Unlocked Concept #10: Fast & Slow Pointer (Cycle Detection)

**Category:** `Algorithms`  
**Unlocked At:** 2026-09-23 20:06  
**Reward:** `+25 XP`  

---

### 📖 Summary
Floyd's Tortoise and Hare algorithm detects loops in linked lists or sequences in O(1) space.

---

### 💻 Code Implementation
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

---

### 🎯 Key Takeaway
> **"If a cycle exists, the fast runner (2 steps) will always lap and catch the slow runner (1 step)."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
