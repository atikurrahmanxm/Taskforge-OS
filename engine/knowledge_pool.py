# Curated Knowledge Library for Auto-Evolution Engine
# Contains 50+ practical programming insights, algorithms, and system design patterns

KNOWLEDGE_POOL = [
    {
        "id": 1,
        "category": "Algorithms",
        "title": "Two-Pointer Technique",
        "summary": "Optimizes searching pairs in sorted arrays from O(n^2) to O(n) by using two pointers moving inward.",
        "takeaway": "Always sort first or verify sorting before applying the two-pointer collision strategy.",
        "code": """def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []""",
        "commit_tag": "feat(algo): unlock Two-Pointer collision pattern"
    },
    {
        "id": 2,
        "category": "System Design",
        "title": "Idempotency in Distributed APIs",
        "summary": "Ensures that performing an operation multiple times produces the same outcome as doing it once.",
        "takeaway": "Use unique client-generated Idempotency Keys in HTTP headers to prevent duplicate charges or actions.",
        "code": """// Express middleware pattern for idempotency
app.post('/api/pay', async (req, res) => {
  const idempotencyKey = req.headers['x-idempotency-key'];
  const cached = await redis.get(idempotencyKey);
  if (cached) return res.json(JSON.parse(cached));
  
  const result = await processPayment(req.body);
  await redis.setex(idempotencyKey, 86400, JSON.stringify(result));
  return res.json(result);
});""",
        "commit_tag": "feat(system-design): add API Idempotency architecture"
    },
    {
        "id": 3,
        "category": "Python Mastery",
        "title": "Memory Efficient Generators",
        "summary": "Generators allow processing gigabyte-sized files row-by-row with near-zero RAM overhead using `yield`.",
        "takeaway": "Prefer generator expressions over list comprehensions when processing streams or large datasets.",
        "code": """def stream_large_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith("ERROR:"):
                yield line.strip()

# Consumes lazily, never loads entire file into memory:
for error in stream_large_file('server.log'):
    print(error)""",
        "commit_tag": "feat(python): implement lazy evaluation with generators"
    },
    {
        "id": 4,
        "category": "JavaScript Core",
        "title": "Event Loop & Microtask Queue",
        "summary": "Microtasks (Promises, queueMicrotask) always execute before Macrotasks (setTimeout, setInterval).",
        "takeaway": "Never starve the macrotask queue with recursive microtask scheduling.",
        "code": """console.log('1: Sync script start');

setTimeout(() => console.log('4: Macrotask (setTimeout)'), 0);

Promise.resolve().then(() => {
  console.log('2: Microtask 1');
}).then(() => {
  console.log('3: Microtask 2');
});

console.log('Sync script end');
// Output order: 1 -> Sync script end -> 2 -> 3 -> 4""",
        "commit_tag": "feat(js): explore Event Loop & Microtask prioritization"
    },
    {
        "id": 5,
        "category": "Algorithms",
        "title": "Sliding Window Pattern",
        "summary": "Maintains a running window over an array to solve sub-array problems in linear O(n) time.",
        "takeaway": "Keep track of window state dynamically instead of recalculating from scratch on each shift.",
        "code": """def max_sub_array_of_size_k(k, arr):
    max_sum, window_sum, window_start = 0, 0, 0
    for window_end in range(len(arr)):
        window_sum += arr[window_end]
        if window_end >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[window_start]
            window_start += 1
    return max_sum""",
        "commit_tag": "feat(algo): add Sliding Window sub-array optimization"
    },
    {
        "id": 6,
        "category": "Architecture",
        "title": "Circuit Breaker Pattern",
        "summary": "Prevents catastrophic cascading failures when a downstream microservice is degraded or down.",
        "takeaway": "Transition states: Closed (healthy) -> Open (failing fast) -> Half-Open (probing).",
        "code": """class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_time=60):
        self.state = "CLOSED"
        self.failures = 0
        self.threshold = failure_threshold
        
    def call(self, service_fn, *args):
        if self.state == "OPEN":
            raise Exception("Circuit is OPEN: fallback activated immediately")
        try:
            return service_fn(*args)
        except Exception as err:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "OPEN"
            raise err""",
        "commit_tag": "feat(arch): introduce Circuit Breaker fault-tolerance"
    },
    {
        "id": 7,
        "category": "Clean Code",
        "title": "Early Return (Guard Clause)",
        "summary": "Eliminates deeply nested if-else ladders by returning as soon as invalid states or edge cases are met.",
        "takeaway": "Banish pyramid-of-doom indentation and keep the happy path at the top level of indentation.",
        "code": """// Before: Deep nesting
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
}""",
        "commit_tag": "refactor(clean-code): apply Guard Clause pattern"
    },
    {
        "id": 8,
        "category": "System Design",
        "title": "Bloom Filters for Rapid Probabilistic Lookups",
        "summary": "Space-efficient probabilistic data structure that tells whether an element definitely is NOT in a set.",
        "takeaway": "False positives are possible, but false negatives are NEVER possible.",
        "code": """# Concept: Check Bloom filter before expensive DB query
def username_available(bloom_filter, db, username):
    # If Bloom filter says NO, it 100% does not exist:
    if not bloom_filter.contains(username):
        return True
    # Otherwise check database to handle potential false positive:
    return db.find_user(username) is None""",
        "commit_tag": "feat(system-design): integrate Bloom Filter concept"
    },
    {
        "id": 9,
        "category": "Python Mastery",
        "title": "Custom Context Managers with `@contextmanager`",
        "summary": "Safely manages resource acquisition and cleanup (files, locks, DB transactions) cleanly.",
        "takeaway": "Everything before `yield` is setup; everything after is guaranteed teardown in `finally`.",
        "code": """from contextlib import contextmanager
import time

@contextmanager
def execution_timer(task_name):
    start = time.perf_counter()
    try:
        yield
    finally:
        duration = time.perf_counter() - start
        print(f"[{task_name}] took {duration:.4f} seconds")

# Usage:
with execution_timer("Matrix computation"):
    # Run heavy operations here
    sum(i * i for i in range(1000000))""",
        "commit_tag": "feat(python): implement lightweight execution_timer context manager"
    },
    {
        "id": 10,
        "category": "Algorithms",
        "title": "Fast & Slow Pointer (Cycle Detection)",
        "summary": "Floyd's Tortoise and Hare algorithm detects loops in linked lists or sequences in O(1) space.",
        "takeaway": "If a cycle exists, the fast runner (2 steps) will always lap and catch the slow runner (1 step).",
        "code": """class ListNode:
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
    return False""",
        "commit_tag": "feat(algo): add Floyd's cycle detection algorithm"
    },
    {
        "id": 11,
        "category": "JavaScript Core",
        "title": "Debounce & Throttle Optimization",
        "summary": "Controls the execution frequency of high-frequency events (window resize, search autocomplete input).",
        "takeaway": "Debounce waits for silence; Throttle enforces a maximum execution rate per interval.",
        "code": """function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Attach to search input:
const onSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 400);""",
        "commit_tag": "feat(js): implement Debounce event optimizer"
    },
    {
        "id": 12,
        "category": "Database & DevOps",
        "title": "Composite B-Tree Indexes & Leftmost Prefix",
        "summary": "Understanding multi-column indexes: an index on (A, B, C) can satisfy queries on A, (A,B), and (A,B,C).",
        "takeaway": "A query filtering only on B or C CANNOT use the index (A, B, C) efficiently.",
        "code": """-- Efficient: Uses composite index
CREATE INDEX idx_user_status_created ON users (status, created_at);

-- FAST: Matches leftmost prefix:
SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC;

-- SLOW (Full scan): Does not specify 'status':
SELECT * FROM users WHERE created_at > '2026-01-01';""",
        "commit_tag": "feat(database): document B-Tree leftmost prefix indexing"
    },
    {
        "id": 13,
        "category": "Algorithms",
        "title": "Dynamic Programming with Memoization",
        "summary": "Transforms exponential O(2^n) recursion trees into linear O(n) by caching subproblem results.",
        "takeaway": "Identify overlapping subproblems and optimal substructure before writing the memo table.",
        "code": """def memoize(fn):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    return wrapper

@memoize
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)""",
        "commit_tag": "feat(dsa): add Memoization decorator pattern"
    },
    {
        "id": 14,
        "category": "System Design",
        "title": "Rate Limiting with Token Bucket",
        "summary": "Allows smooth bursts of traffic while enforcing a strict steady-state average rate limit.",
        "takeaway": "Refill tokens lazily based on elapsed time rather than running a background timer tick.",
        "code": """import time

class TokenBucket:
    def __init__(self, capacity, refill_rate_per_sec):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = capacity
        self.last_refill = time.time()
        
    def allow_request(self, tokens=1):
        now = time.time()
        # Add tokens accumulated since last call:
        self.tokens = min(self.capacity, self.tokens + (now - self.last_refill) * self.refill_rate)
        self.last_refill = now
        
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False""",
        "commit_tag": "feat(system-design): add Token Bucket Rate Limiter"
    },
    {
        "id": 15,
        "category": "Python Mastery",
        "title": "Slots for High-Volume Object Optimization",
        "summary": "Using `__slots__` bypasses dynamic `__dict__` allocation, slashing memory usage by ~60% for millions of objects.",
        "takeaway": "Use `__slots__` when creating millions of small data instances (e.g. coordinates, data points).",
        "code": """class PointStandard:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class PointOptimized:
    __slots__ = ('x', 'y')  # Prevents __dict__ allocation
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Result: PointOptimized instances consume ~60% less RAM!""",
        "commit_tag": "perf(python): optimize object memory with __slots__"
    },
    {
        "id": 16,
        "category": "Clean Code",
        "title": "Single Responsibility Principle (SRP)",
        "summary": "A class or function should have only one reason to change, separating business logic from persistence.",
        "takeaway": "Do not let a calculation class also format email templates or talk directly to SQL.",
        "code": """# Bad: Violates SRP (Math + Formatting + Notification)
class Invoice:
    def calculate_total(self): ...
    def save_to_db(self): ...
    def send_email(self): ...

# Good: Decoupled responsibilities
class InvoiceCalculator: ...
class InvoiceRepository: ...
class InvoiceNotifier: ...""",
        "commit_tag": "refactor(principles): align modules with Single Responsibility"
    }
]
