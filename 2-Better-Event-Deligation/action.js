deleteBtn.className = "delete";
editBtn.className = "edit";
saveBtn.className = "save";
cancelBtn.className = "cancel";

/*
No Per-item listeners

No Nested listeners

No Memory concerns

No Cleanup issues
----------------------
Better code:
One listener

Centralized logic

Predictable behavior

Scales to 10 or 10,000 items
*/

list.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("delete")) {
        handleDelete(target);
    }

    if (target.classList.contains("edit")) {
        handleEdit(target);
    }

    if (target.classList.contains("save")) {
        handleSave(target);
    }

    if (target.classList.contains("cancel")) {
        handleCancel(target);
    }
});

function handleDelete(button) {
    const listItem = button.closest("li");
    listItem.remove();
}

function handleEdit(button) {
    const listItem = button.closest("li");
    const span = listItem.querySelector("span");

    const input = document.createElement("input");
    input.value = span.textContent;

    const save = document.createElement("button");
    save.textContent = "Save";
    save.className = "save";

    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.className = "cancel";

    listItem.replaceChildren(input, save, cancel);
    input.focus();
}

function handleSave(button) {
    const listItem = button.closest("li");
    const input = listItem.querySelector("input");

    const span = document.createElement("span");
    span.textContent = input.value.trim() || "Untitled";

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.className = "edit";

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete";

    listItem.replaceChildren(span, del, edit);
}

function handleCancel(button) {
    handleSave(button); // reuse logic
}
