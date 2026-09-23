# 💡 Unlocked Concept #16: Single Responsibility Principle (SRP)

**Category:** `Clean Code`  
**Unlocked At:** 2026-09-23 22:29  
**Reward:** `+25 XP`  

---

### 📖 Summary
A class or function should have only one reason to change, separating business logic from persistence.

---

### 💻 Code Implementation
```python
# Bad: Violates SRP (Math + Formatting + Notification)
class Invoice:
    def calculate_total(self): ...
    def save_to_db(self): ...
    def send_email(self): ...

# Good: Decoupled responsibilities
class InvoiceCalculator: ...
class InvoiceRepository: ...
class InvoiceNotifier: ...
```

---

### 🎯 Key Takeaway
> **"Do not let a calculation class also format email templates or talk directly to SQL."**

---
*Auto-generated & cataloged by DevLog Hub Evolution Engine.*
