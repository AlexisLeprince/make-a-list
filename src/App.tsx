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

  // Variables
  const content = useRef<HTMLInputElement | null>(null);

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

  // HTML
  return (
    <div className="App">
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
