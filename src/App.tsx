import { useEffect, useRef, useState } from "react";
import "./App.css";
import Task from "./components/Task/Task";

type TaskType = {
  content: string;
  done: boolean;
};

function App() {
  // State
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [error, setError] = useState<string>("");

  const [addInput, setAddInput] = useState<boolean>(false);

  const [listName, setListName] = useState<string>(() => {
    const savedListName = localStorage.getItem("listName");
    return savedListName ? JSON.parse(savedListName) : "";
  });

  // Variables
  const content = useRef<HTMLInputElement | null>(null);
  const listNameInput = useRef<HTMLInputElement | null>(null);

  // Functions
  const doneClickHandler = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !tasks[index].done;
    setTasks(newTasks);
  };

  const removeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const removeAllTasks = () => {
    setTasks([]);
  };

  const selectAllTasksHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTasks = tasks.map((task) => ({
      ...task,
      done: e.target.checked,
    }));
    setTasks(newTasks);
  };

  const setNewTask = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = content.current?.value.trim();

    if (!value) {
      setError("Veuillez saisir une tache");
      return;
    }

    setTasks([...tasks, { content: value, done: false }]);

    setError("");
  };

  const setNewListName = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = listNameInput.current?.value.trim();

    if (!value) {
      setError("Veuillez saisir un nom de liste");
      return;
    }
    setListName(value);
    setError("");
  };

  // Cycle
  useEffect(() => {
    content.current?.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (content.current) {
      content.current.value = "";
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("listName", JSON.stringify(listName));
  }, [listName]);

  // HTML
  return (
    <div className="App">
      <header>
        <span>TO-DO</span>
      </header>
      {!listName &&
        (!addInput ? (
          <button
            type="button"
            onClick={() => setAddInput(!addInput)}
            className="addInputListName"
          >
            Ajouter un nom à cette liste
          </button>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setAddInput(!addInput)}
              className="addInputListName"
            >
              Retirer le nom de cette liste
            </button>
            <div className="addListName">
              <form onSubmit={(event) => setNewListName(event)}>
                <input
                  type="text"
                  placeholder="Nom de la liste"
                  ref={listNameInput}
                  onChange={() => setError("")}
                />
                <button type="submit">Ajouter</button>
              </form>
            </div>
          </div>
        ))}

      <div className="add">
        <form
          onSubmit={(event) => {
            setNewTask(event);
          }}
        >
          <input
            type="text"
            placeholder="Que souhaitez-vous ajouter ?"
            ref={content}
            onChange={() => setError("")}
          />
          <button type="submit">Ajouter</button>
        </form>

        {error && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>
            {error}
          </p>
        )}
      </div>
      {listName && (
        <div className="list-name-container">
          <h2 className="list-name">{listName}</h2>
          <button type="button" onClick={() => listNameHandler()}>
            Modifier le nom de la liste
          </button>
          <button
            type="button"
            className="remove-button"
            onClick={() => removeListName()}
          >
            Supprimer le nom de la liste
          </button>
        </div>
      )}
      {tasks.length > 0 && (
        <div>
          <div className="task-actions">
            <label>
              <input
                type="checkbox"
                onChange={(e) => selectAllTasksHandler(e)}
              />
              Tout sélectionner
            </label>

            <button
              type="button"
              className="clear-tasks"
              onClick={removeAllTasks}
              disabled={tasks.length === 0}
            >
              <svg
                xmlns="http://w3.org"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Supprimer toutes les tâches
            </button>
          </div>
        </div>
      )}

      {tasks.map((task, index) => (
        <Task
          key={index}
          content={task.content}
          done={task.done}
          doneClicked={() => doneClickHandler(index)}
          remTask={() => removeTask(index)}
        />
      ))}
    </div>
  );
}

export default App;
