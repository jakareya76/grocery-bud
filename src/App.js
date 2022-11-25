import { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  const list = localStorage.getItem("GROCERY_BUD");

  if (!list) {
    return [];
  } else {
    return JSON.parse(list);
  }
};

const App = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      showAlert(true, "danger", "Please Enter Value");
    } else if (name && isEditing) {
      setList((prevState) => {
        return prevState.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }

          return item;
        });
      });

      setName("");
      setEditId(null);
      setIsEditing(false);

      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "Item Added To The List");

      const newItem = { id: new Date().getTime().toString(), title: name };
      setList((prevState) => {
        return [...prevState, newItem];
      });

      setName("");
    }
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => {
      return item.id === id;
    });

    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };

  const deleteItem = (id) => {
    setList((prevState) => {
      return prevState.filter((item) => {
        return id !== item.id;
      });
    });

    showAlert(true, "danger", "Item Removed");
  };

  const clearItems = () => {
    showAlert(true, "danger", "Empty List");
    setList([]);
  };

  useEffect(() => {
    localStorage.setItem("GROCERY_BUD", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show ? (
          <Alert {...alert} removeAlert={showAlert} list={list} />
        ) : null}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>
      {list.length > 0 ? (
        <div className="grocery-container">
          <List items={list} deleteItem={deleteItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearItems}>
            Clear Items
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default App;
