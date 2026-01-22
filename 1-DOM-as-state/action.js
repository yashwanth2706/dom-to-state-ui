const list = document.querySelector("ol");
const input = document.querySelector("input");
const button = document.querySelector("button");

button.addEventListener("click", (event) => {
    event.preventDefault();

    const myItem = input.value.trim();
    /* if (!myItem) {
        alert("Add something to the list!");
        return;
    } */

    input.value = "";

    const listItem = document.createElement("li");

    const listText = document.createElement("span");
    listText.textContent = myItem;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    listItem.append(listText, deleteBtn, editBtn);

    list.appendChild(listItem);

    // DELETE
    deleteBtn.addEventListener("click", ()=> {
        listItem.remove();
    });

    // EDIT
    editBtn.addEventListener("click", ()=>{
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = listText.textContent;

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";

        const cancleBtn = document.createElement("button");
        cancleBtn.textContent = "Cancel";

        // Replace span + edit button with input + save, cancel
        listItem.replaceChild(editInput, listText);
        listItem.replaceChild(saveBtn, editBtn);
        listItem.replaceChild(cancleBtn, deleteBtn);

        // SAVE
        saveBtn.addEventListener("click", () => {
            listText.textContent = editInput.value.trim() || listText.textContent;
            exitMode();
        });

        // CANCEL
        cancleBtn.addEventListener("click", exitMode);

        function exitMode() {
            listItem.replaceChild(listText, editInput);
            listItem.replaceChild(editBtn, saveBtn);
            listItem.replaceChild(deleteBtn, cancleBtn);
        }
        editInput.focus();
    });

    input.focus();
});