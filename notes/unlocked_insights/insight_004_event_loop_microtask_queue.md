# 💡 Unlocked Concept #4: Event Loop & Microtask Queue

**Category:** `JavaScript Core`  
**Unlocked At:** 2026-09-22 00:17  
**Reward:** `+25 XP`  

---

### 📖 Summary
Microtasks (Promises, queueMicrotask) always execute before Macrotasks (setTimeout, setInterval).

---

### 💻 Code Implementation
```python
console.log('1: Sync script start');

setTimeout(() => console.log('4: Macrotask (setTimeout)'), 0);

Promise.resolve().then(() => {
  console.log('2: Microtask 1');
}).then(() => {
  console.log('3: Microtask 2');
});

console.log('Sync script end');
// Output order: 1 -> Sync script end -> 2 -> 3 -> 4
```

---

### 🎯 Key Takeaway
> **"Never starve the macrotask queue with recursive microtask scheduling."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
