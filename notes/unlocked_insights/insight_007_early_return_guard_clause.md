# 💡 Unlocked Concept #7: Early Return (Guard Clause)

**Category:** `Clean Code`  
**Unlocked At:** 2026-09-23 19:15  
**Reward:** `+25 XP`  

---

### 📖 Summary
Eliminates deeply nested if-else ladders by returning as soon as invalid states or edge cases are met.

---

### 💻 Code Implementation
```python
// Before: Deep nesting
function processOrder(order) {
  if (order) {
    if (order.isValid) {
      if (order.isPaid) {
        return ship(order);
      }
    }
  }
}

// After: Guard Clauses
function processOrder(order) {
  if (!order || !order.isValid) return { error: "Invalid order" };
  if (!order.isPaid) return { error: "Payment pending" };
  return ship(order);
}
```

---

### 🎯 Key Takeaway
> **"Banish pyramid-of-doom indentation and keep the happy path at the top level of indentation."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
