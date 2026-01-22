// Create State (DATA)
/* const item = {
  id: 1,
  text: "Buy milk",
  isEditing: false
}; */

/*
--- DOM as State model ---
User clicks → Find DOM → Modify DOM → Hope state stays correct
--------------------------
--- State first model ---
User clicks → Update data → Re-render UI
*/

// STEP 1: Define STATE
let items = [];

// Each item will look like:
/*
{
  id: 123,
  text: "Buy milk",
  isEditing: false
}
*/
// ABOVE THREE ARE THE "TRUTH"

// STEP 2: DOM references (read-only)
const list = document.querySelector("#list");
const input = document.querySelector("#itemInput");
const addBtn = document.querySelector("#addBtn");

// STEP 3: Add item → UPDATE STATE (not DOM)
// No: (createElement,appendChild,replaceChild)
// Just: Update State Render
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  items.push({
    id: Date.now(),
    text,
    isEditing: false
  });

  input.value = "";
  render();
});

// STEP 4: Render function (DOM is rebuilt from state)
// Core idea: UI = function(state)
function render() {
  list.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");

    if (item.isEditing) {
      renderEditMode(li, item);
    } else {
      renderViewMode(li, item);
    }

    list.appendChild(li);
  });
}

// STEP 5: View mode (not editing)
// Clicking Does not touch DOM, Just updates state
function renderViewMode(li, item) {
  const span = document.createElement("span");
  span.textContent = item.text;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    item.isEditing = true;
    render();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    items = items.filter(i => i.id !== item.id);
    render();
  };

  li.append(span, editBtn, deleteBtn);
}

// STEP 6: Edit MODE
function renderEditMode(li, item) {
  const input = document.createElement("input");
  input.value = item.text;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.onclick = () => {
    item.text = input.value.trim() || item.text;
    item.isEditing = false;
    render();
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => {
    item.isEditing = false;
    render();
  };

  li.append(input, saveBtn, cancelBtn);
}

