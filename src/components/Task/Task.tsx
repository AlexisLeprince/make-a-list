import { useEffect, useRef, useState } from "react";
import classes from "./Task.module.css";

type TaskProps = {
  content: string;
  done: boolean;
  doneClicked: () => void;
  remTask: () => void;
  majTask: (content: string) => void;
};

export default function Task({
  content,
  done,
  doneClicked,
  remTask,
  majTask,
}: TaskProps) {
  const [contentToInput, setContentToInput] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editError, setEditError] = useState("");
  const editInput = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setEditedContent(content);
    setEditError("");
    setContentToInput(true);
  };

  const cancelEditing = () => {
    setEditedContent(content);
    setEditError("");
    setContentToInput(false);
  };

   useEffect(() => {
    if (contentToInput) {
      editInput.current?.focus();
    }
  }, [contentToInput]);

  return (
    <div className={classes.task}>
      <div className={classes.content} onClick={doneClicked}>
        {done ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className={classes.checkboxIcon}
              role="checkbox"
              aria-label="Marquer la tâche comme non terminée"
              aria-checked={done}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  doneClicked();
                }
              }}
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
            </svg>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className={classes.checkboxIcon}
              role="checkbox"
              aria-label="Marquer la tâche comme terminée"
              aria-checked={done}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  doneClicked();
                }
              }}
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            </svg>
          </>
        )}
        {contentToInput ? (
          <form
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              const value = editedContent.trim();

              if (!value) {
                setEditError("La tâche ne peut pas être vide");
                return;
              }

              majTask(value);
              setEditError("");
              setContentToInput(false);
            }}
          >
            <input
              ref={editInput}
              type="text"
              value={editedContent}
              onChange={(event) => {
                setEditedContent(event.target.value);
                setEditError("");
              }}
              className={classes.editInput}
              aria-label="Modifier le contenu de la tâche"
              size={Math.max(editedContent.length, 1)}
            />
            {editError && <span role="alert">{editError}</span>}
          </form>
        ) : (
          <span>{done ? <s>{content}</s> : content}</span>
        )}
      </div>

      <svg
        role="button"
        tabIndex={0}
        aria-label="Modifier la tâche"
        className={classes.editIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={() => {
          if (contentToInput) {
            cancelEditing();
          } else {
            startEditing();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (contentToInput) {
              cancelEditing();
            } else {
              startEditing();
            }
          }
        }}
      >
        <path d="m16 5 3 3M4 20l4.5-1 11-11a2.12 2.12 0 0 0-3-3l-11 11L4 20Z" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
        className={classes.removeIcon}
        role="button"
        tabIndex={0}
        aria-label="Supprimer la tâche"
        onClick={remTask}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            remTask();
          }
        }}
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
      </svg>
    </div>
  );
}
