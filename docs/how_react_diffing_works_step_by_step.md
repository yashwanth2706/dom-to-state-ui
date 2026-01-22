## How Diffing Works (Step by Step)

### First: what is being diffed?

❌ **NOT the real DOM**  
✅ **Two UI descriptions (plain JS objects)**

Think of them as **snapshots of intent**.

---

## Step 0: Initial render

### Component
```js
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
```

### State
```js
items = [
  { id: 1, text: "Milk" },
  { id: 2, text: "Eggs" }
];
```

### React creates description A
```js
A = {
  type: "ul",
  children: [
    { type: "li", key: 1, children: [
        { type: "span", text: "Milk" }
    ]},
    { type: "li", key: 2, children: [
        { type: "span", text: "Eggs" }
    ]}
  ]
};
```

React builds the real DOM from this.

---

## Step 1: State changes

User edits:
```js
items = [
  { id: 1, text: "Milk + Eggs" },
  { id: 2, text: "Eggs" }
];
```

React **re-runs the component**.

---

## Step 2: New description is produced
```js
B = {
  type: "ul",
  children: [
    { type: "li", key: 1, children: [
        { type: "span", text: "Milk + Eggs" }
    ]},
    { type: "li", key: 2, children: [
        { type: "span", text: "Eggs" }
    ]}
  ]
};
```

---

## Step 3: Diffing starts (top-down)

React compares **A vs B** node by node.

**Rule 1:** Same type → compare children
```
ul === ul → compare children
```

---

## Step 4: Children comparison (keys matter)

Children are matched by **key**, not position.

```
A.children[key=1] ↔ B.children[key=1]
A.children[key=2] ↔ B.children[key=2]
```

No guessing. No DOM scanning.

---

## Step 5: Compare inside `<li key=1>`
```diff
<span>
- Milk
+ Milk + Eggs
</span>
```

React records:
```js
mutation = {
  node: span,
  type: "TEXT_UPDATE",
  value: "Milk + Eggs"
};
```

---

## Step 6: Skip unchanged branches
```html
<li key=2>
  <span>Eggs</span>
</li>
```

Same → **skip entire subtree**  
No work. Zero cost.

---

## Step 7: Commit phase (actual DOM touch)

React batches all mutations:
```js
span.textContent = "Milk + Eggs";
```

That’s it.

---

## Why this is efficient

### What React did **NOT** do
- ❌ Remove `<li>`
- ❌ Re-create buttons
- ❌ Re-attach listeners
- ❌ Query the DOM

### What React **DID** do
- ✔️ One string comparison
- ✔️ One DOM text update

---

## What happens when structure changes?

### Case: New item added
```js
items = [
  { id: 1, text: "Milk" },
  { id: 2, text: "Eggs" },
  { id: 3, text: "Bread" }
];
```

**Diff result:**
```
INSERT <li key=3> at end
```

Only **one node** created.

---

### Case: Item removed
```js
items = [
  { id: 2, text: "Eggs" }
];
```

**Diff result:**
```
REMOVE <li key=1>
```

---

### Case: No keys (IMPORTANT)
```js
items.map(item => <li>{item.text}</li>)
```

React matches by **index**:
```
index 0: Milk → Eggs
index 1: Eggs → Bread
```

Results:
- Wrong nodes reused
- Inputs lose focus
- Animations glitch

This is why **keys are not optional**.

---

## Key insight (the “aha”)

> **Diffing compares intent to intent, not reality to reality.**

DOM reality may be corrupted.  
Intent is always clean.

---

## Why vanilla JS cannot do this safely

**Vanilla JS:**
- Sees only current DOM
- Has no memory of previous intent
- Cannot know what *should* have changed

**React:**
- Has previous intent
- Has next intent
- Computes the minimal transition

---

## One-sentence summary

> React never asks **“what happened to the DOM?”**  
> It asks **“what should the DOM look like now?”**

Once you think this way, **state-first UI becomes obvious**.

