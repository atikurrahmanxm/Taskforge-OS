# 💡 Unlocked Concept #11: Debounce & Throttle Optimization

**Category:** `JavaScript Core`  
**Unlocked At:** 2026-09-23 22:25  
**Reward:** `+25 XP`  

---

### 📖 Summary
Controls the execution frequency of high-frequency events (window resize, search autocomplete input).

---

### 💻 Code Implementation
```python
function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Attach to search input:
const onSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 400);
```

---

### 🎯 Key Takeaway
> **"Debounce waits for silence; Throttle enforces a maximum execution rate per interval."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
