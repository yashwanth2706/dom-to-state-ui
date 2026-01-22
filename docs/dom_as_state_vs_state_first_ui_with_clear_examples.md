# DOM-as-State vs State-First UI

This document is written to **lock in the mental model** of DOM-as-State vs State-First UI

---

## 1️⃣ DOM-as-State

The problem:

> In DOM-first thinking, you need to locate where the data lives in the DOM using class or ID, then update or replace that DOM node.

Example:
```html
<li><span>My Data</span></li>
```

To edit it, you either:
- Find the `<span>` and change `textContent`
- OR remove the `<li>` and create a new one

✅ **This understanding is 100% correct**

This approach is called **DOM-as-state** because:
- The *data* lives inside DOM nodes
- The DOM structure itself represents the application state

---

## 2️⃣ DOM-as-State (Imperative Thinking)

### Example

```js
const span = document.querySelector("li span");
span.textContent = "Edited Data";
```

### What is happening conceptually

```text
DOM = source of truth
↓
Read DOM
↓
Decide what to do
↓
Mutate DOM
```

### Problems (these appear at scale)

- You must **search the DOM** to know the current state
- UI logic is spread across event handlers
- Impossible states can occur (half-edited UI)
- Bugs appear when async updates happen

The DOM is doing **two jobs**:
1. Displaying UI
2. Storing application data ❌

---

## 3️⃣ State-First Thinking (Declarative)

### Core rule (memorize this)

> **State is the source of truth. DOM is just an output.**

Example state:
```js
let state = {
  items: [
    { id: 1, text: "My Data" }
  ]
};
```

Here:
- Data is explicit
- Serializable
- Easy to debug

---

## 4️⃣ Rendering from State (This is the key shift)

### Render function

```js
function render(state) {
  const list = document.querySelector("ol");
  list.innerHTML = ""; // clear

  state.items.forEach(item => {
    const li = document.createElement("li");
    const span = document.createElement("span");

    span.textContent = item.text;
    li.appendChild(span);
    list.appendChild(li);
  });
}
```

### Important

- `render()` **does not care about clicks**
- `render()` **does not mutate state**
- It only does: **state → DOM**

---

## 5️⃣ What does “re-render” ACTUALLY mean?

This is where most confusion happens.

### ❌ Common misunderstanding

> “Re-render means magically changing existing DOM nodes”

No.

### ✅ What really happens (vanilla JS)

```js
render(state);
```

This usually means:
1. Remove old DOM output (often via `innerHTML = ""`)
2. Create **new DOM nodes** using `createElement`
3. Append them

So yes — **nodes are recreated**.

---

## 6️⃣ Isn’t recreating DOM inefficient?

### Short answer

❌ *Only if done naively at large scale*

### Why it works anyway

- DOM creation is faster than you think
- Small/medium apps are totally fine
- Code becomes predictable and bug-free

But yes — **full re-rendering does not scale infinitely**.

This is exactly where frameworks step in.

---

## 7️⃣ What frameworks (React) add on top

React does NOT do this:
```js
root.innerHTML = "";
```

Instead:

```text
Previous Virtual UI
        ↓
Next Virtual UI
        ↓
Diff (what changed?)
        ↓
Minimal real DOM updates
```

### Key insight

> React still **re-renders conceptually**, but **updates DOM minimally**.

You write:
```jsx
setState(newState);
```

React handles:
- Diffing
- Batching
- Performance

---

## 8️⃣ Why state-first is NOT about performance first

This is critical:

> **State-first is about correctness first, performance second.**

Benefits:
- No impossible UI states
- Easier debugging
- Easier async handling
- Scales in complexity

Performance optimizations come later.

---

## 9️⃣ Mental model (burn this in)

### DOM-as-state
```text
DOM → logic → DOM
```

### State-first
```text
State → render → DOM
```

DOM is never consulted for decisions.

---

## 🔟 Why existing DOM nodes are NOT trusted

This answers the core question:

> **Why don’t we touch existing nodes?**
>
> Because existing nodes are not trusted.

---

### 1️⃣ The DOM is an OUTPUT, not an INPUT

Think of the UI pipeline:

```text
State (data) → UI (DOM)
```

Once the DOM is created, it is:
- A snapshot
- A projection
- A rendered result

Just like:
- HTML generated from a template
- A PDF exported from a document
- A compiled binary from source code

You would never edit the PDF and expect the Word document to stay correct.

Same rule applies here.

---

### 2️⃣ DOM can contain conflicting truths

Example:

```html
<li>
  <span>Milk</span>
  <input value="Milk + Eggs" />
</li>
```

Now ask:
- Is the value `Milk`?
- Is it `Milk + Eggs`?
- Did the user finish editing?
- Did an async update happen?

The DOM cannot answer these questions reliably.

---

### 3️⃣ Too many things can mutate the DOM

The DOM can change because of:
- User input
- Browser autofill
- Async callbacks
- Third‑party scripts
- CSS-driven reflows
- Timing issues
- Previous bugs

So this is unreliable:

```js
const text = span.textContent;
```

It is **whatever happened last**, not necessarily the truth.

---

### 4️⃣ Timing destroys DOM reliability

```js
setTimeout(() => span.textContent = "A", 100);
setTimeout(() => span.textContent = "B", 50);
```

The DOM shows `B`, but your intent was `A`.

DOM only shows the **final side effect**, not the logical sequence.

---

### 5️⃣ DOM shows appearance, not meaning

DOM can tell you:
```html
<input />
```

State can tell you:
```js
{ editing: true, dirty: true, valid: false }
```

Meaning does not live in the DOM.

---

### 6️⃣ Why state *is* trusted

State is:
- Centralized
- Explicit
- Serializable
- Time‑ordered
- Controlled

```js
state = {
  items: [{ id: 1, text: "Milk", editing: true }]
};
```

Nothing mutates this silently.

---

### 7️⃣ Why re‑rendering is safer than mutation

Re‑rendering means:

```text
Ignore existing DOM
↓
Trust state only
↓
Rebuild UI from state
```

This resets drift and guarantees consistency.

---

### 8️⃣ The mental model to remember

DOM is like:
- Screen pixels

State is like:
- Variables in memory

You never read pixels to know a variable’s value.

---

## 🧠 What if we pause async updates or apply edits later?

This is a very common and **very reasonable** question:

> *“What if I pause async updates, or store edited data somewhere, and after async finishes I update the value?”*

At first glance, this sounds like it could fix DOM-as-state problems.

---

## 1️⃣ This instinct is correct — but notice what happens

The moment you say:

- “store edited data somewhere”
- “wait until async finishes”
- “apply changes later”

You have already introduced **state**.

Example:
```js
let draftValue = "Milk + Eggs";
let isEditing = true;
let pendingRequests = 2;
```

This data:
- Does NOT live in the DOM
- Must survive async boundaries
- Must stay consistent

So the problem shifts from:
> “How do I update the DOM?”

to:
> **“Where does this state live, and who controls it?”**

---

## 2️⃣ Why pausing async updates does not scale

### ❌ You don’t control all async sources

Async updates can come from:
- Network responses
- WebSockets
- Timers
- User interactions
- Browser autofill
- Third-party scripts

You cannot reliably "pause" reality.

---

### ❌ Async updates are unordered

Example timeline:
```text
User edit → async A starts
User edit → async B starts
Async B finishes
Async A finishes (late)
```

Now ask:
- Which update should win?
- Should the older response overwrite the newer edit?

The DOM cannot answer this.

---

## 3️⃣ You have entered concurrency territory

What you are describing is a **race condition**.

You now need rules:
- Should later edits cancel earlier requests?
- Should failures rollback changes?
- Should server data override user input?
- How do we ignore stale responses?

These are **state transition rules**, not DOM logic.

---

## 4️⃣ Why DOM cannot solve this problem

The DOM:
- Has no concept of intent
- Has no concept of versioning
- Has no concept of ownership
- Has no concept of time ordering

It only shows:
> “This is what I look like now.”

That is not enough to guarantee correctness.

---

## 5️⃣ How state solves this cleanly

With explicit state:

```js
state = {
  value: "Milk",
  draft: "Milk + Eggs",
  editing: true,
  pendingRequestId: 42,
  status: "saving"
};
```

Now you can say:
- If `requestId` ≠ current → ignore
- If `status === saving` → block overwrite
- If failure → rollback draft
- If success → commit draft

This logic is **impossible** to express reliably by inspecting the DOM.

---

## 6️⃣ Important realization

> **Every attempt to fix DOM-as-state ends up recreating state management — badly.**

You start adding:
- Flags
- Locks
- Buffers
- Queues
- Guards
- Version numbers

And your DOM code slowly turns into a fragile framework.

---

## 7️⃣ Why frameworks exist (the real reason)

Frameworks like React did not appear because:
> “DOM is slow”

They appeared because:
> **Async + concurrency make DOM-as-state unmanageable**

Frameworks give you:
- A single source of truth
- Predictable state transitions
- Controlled async handling
- Consistent re-rendering

---

## ✅ Final takeaway

> **If correctness depends on time, ordering, or failure, DOM is the wrong place to store truth.**

State exists to solve exactly this problem.

