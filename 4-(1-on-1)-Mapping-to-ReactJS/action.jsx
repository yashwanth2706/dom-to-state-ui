function App() {
  const [items, setItems] = React.useState([]);

  function addItem(text) {
    setItems([
      ...items,
      { id: Date.now(), text, isEditing: false }
    ]);
  }

  function updateItem(id, updates) {
    setItems(items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }

  function deleteItem(id) {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <>
      <Input onAdd={addItem} />
      <ol>
        {items.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        ))}
      </ol>
    </>
  );
}

// ToDo Item Component
function TodoItem({ item, onUpdate, onDelete }) {
  if (item.isEditing) {
    return (
      <li>
        <input defaultValue={item.text} />
        <button onClick={() =>
          onUpdate(item.id, { isEditing: false })
        }>
          Save
        </button>
        <button onClick={() =>
          onUpdate(item.id, { isEditing: false })
        }>
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li>
      <span>{item.text}</span>
      <button onClick={() =>
        onUpdate(item.id, { isEditing: true })
      }>
        Edit
      </button>
      <button onClick={() =>
        onDelete(item.id)
      }>
        Delete
      </button>
    </li>
  );
}

/*
Vanilla JS	                React
items = []	                useState([])
render()	                React re-render
if (item.isEditing)	        Conditional JSX
createElement	            JSX
onclick	                    onClick
DOM                         Rebuild	Virtual DOM diff
*/


