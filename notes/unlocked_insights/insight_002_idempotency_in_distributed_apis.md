# 💡 Unlocked Concept #2: Idempotency in Distributed APIs

**Category:** `System Design`  
**Unlocked At:** 2026-09-21 01:48  
**Reward:** `+25 XP`  

---

### 📖 Summary
Ensures that performing an operation multiple times produces the same outcome as doing it once.

---

### 💻 Code Implementation
```python
// Express middleware pattern for idempotency
app.post('/api/pay', async (req, res) => {
  const idempotencyKey = req.headers['x-idempotency-key'];
  const cached = await redis.get(idempotencyKey);
  if (cached) return res.json(JSON.parse(cached));
  
  const result = await processPayment(req.body);
  await redis.setex(idempotencyKey, 86400, JSON.stringify(result));
  return res.json(result);
});
```

---

### 🎯 Key Takeaway
> **"Use unique client-generated Idempotency Keys in HTTP headers to prevent duplicate charges or actions."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
