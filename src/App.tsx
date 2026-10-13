import { useEffect, useRef, useState } from "react";
import "./App.css";
import Task from "./components/Task/Task";
import SaveMenu from "./components/SaveMenu/SaveMenu";



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

  const [taskError, setTaskError] = useState<string>("");
  const [listNameError, setListNameError] = useState<string>("");

  const [addInput, setAddInput] = useState<boolean>(false);
  const [listNameToInput, setListNameToInput] = useState<boolean>(false);

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
      setTaskError("Veuillez saisir une tache");
      return;
    }

    setTasks([...tasks, { content: value, done: false }]);

    setTaskError("");
  };

  const majTaskHandler = (index: number, content: string) => {
    const value = content.trim();
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], content: value };
    setTasks(newTasks);
  };

  const setNewListName = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = listNameInput.current?.value.trim();

    if (!value) {
      setListNameError("Veuillez saisir un nom de liste");
      return false;
    }

    setListName(value);
    setListNameError("");

    return true;
  };

  const removeListName = () => {
    setListName("");
    setAddInput(!addInput);
  };

  // Cycle
  useEffect(() => {
    content.current?.focus();
  }, []);

  useEffect(() => {
    listNameInput.current?.focus();
  }, [addInput, listNameToInput]);

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
      <div className="sticky-header">
        <SaveMenu />
        <header>
          <span>TO-DO</span>
        </header>
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
              onChange={() => setTaskError("")}
            />
            <button type="submit">Ajouter</button>
          </form>

          {taskError && (
            <p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>
              {taskError}
            </p>
          )}
        </div>
      </div>
      {!listName &&
        (!addInput ? (
          <button
            type="button"
            onClick={() => setAddInput(!addInput)}
            className="btn-listName"
          >
            Ajouter un nom à cette liste
          </button>
        ) : (
          <div>
            <div className="addListName">
              <form onSubmit={(event) => setNewListName(event)}>
                <button
                  type="button"
                  onClick={() => setAddInput(!addInput)}
                  className="btn-listName"
                >
                  Retirer le nom de cette liste
                </button>
                <input
                  type="text"
                  placeholder="Nom de la liste"
                  ref={listNameInput}
                  className="list-name-input"
                  onChange={() => setListNameError("")}
                />
                <button className="btn-listName" type="submit">
                  Ajouter
                </button>
              </form>
            </div>
            {listNameError && (
              <p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>
                {listNameError}
              </p>
            )}
          </div>
        ))}

      {listName && (
        <div className="list-name-container">
          {!listNameToInput ? (
            <div>
              <h2 className="list-name">{listName}</h2>
              <button
                type="button"
                className="list-name-action"
                aria-label="Modifier le nom de la liste"
                onClick={() => setListNameToInput(!listNameToInput)}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m16 5 3 3M4 20l4.5-1 11-11a2.12 2.12 0 0 0-3-3l-11 11L4 20Z" />
                </svg>
              </button>
              <button
                type="button"
                className="list-name-action"
                aria-label="Supprimer le nom de la liste"
                onClick={() => removeListName()}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="addListName">
              <form
                onSubmit={(event) => {
                  const success = setNewListName(event);

                  if (success) {
                    setListNameToInput(false);
                  }
                }}
              >
                <input
                  type="text"
                  className="list-name-edit-input"
                  defaultValue={listName}
                  size={Math.max(listName.length, 1)}
                  ref={listNameInput}
                  onChange={() => setListNameError("")}
                />

                <button
                  type="submit"
                  className="list-name-action"
                  aria-label="valider le nouveau nom de la liste"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </button>
              </form>
              {listNameError && (
                <p
                  style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}
                >
                  {listNameError}
                </p>
              )}
            </div>
          )}
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
            </label>

            <button type="button" className="saveList">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                <path d="M17 21v-8H7v8M7 3v5h8" />
              </svg>
            </button>


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
          majTask={(content) => majTaskHandler(index, content)}
        />
      ))}
    </div>
  );
}

export default App;
