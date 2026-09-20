# Code Snippet Vault

A collection of handy code snippets across languages. Update this with 1 snippet each day!

---

### 1. Python: Fast JSON File Reader / Writer
```python
import json

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
```

---

### 2. JavaScript: Simple LocalStorage Wrapper
```javascript
const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
```

---

### 3. Git: Useful Daily Git Aliases
```bash
git config --global alias.st status
git config --global alias.cm "commit -m"
git config --global alias.last "log -1 HEAD"
```
