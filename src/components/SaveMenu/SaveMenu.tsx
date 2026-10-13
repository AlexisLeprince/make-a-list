import { useState } from "react";
import classes from "./SaveMenu.module.css";

export default function SaveMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const closeMenu = () => {
    setIsClosing(true);
  };

  const finishClosing = () => {
    if (isClosing) {
      setIsOpen(false);
      setIsClosing(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className={classes.menuButton}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
          aria-controls="save-menu"
          onClick={() => setIsOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      )}

      {isOpen && (
        <>
          <button
            type="button"
            className={classes.backdrop}
            aria-label="Fermer le menu"
            onClick={closeMenu}
          />
          <aside
            id="save-menu"
            className={`${classes.panel} ${isClosing ? classes.closing : ""}`}
            aria-label="Menu"
            onAnimationEnd={finishClosing}
          >
            <button
              type="button"
              className={classes.closeButton}
              aria-label="Fermer le menu"
              onClick={closeMenu}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </aside>
        </>
      )}
    </>
  );
}