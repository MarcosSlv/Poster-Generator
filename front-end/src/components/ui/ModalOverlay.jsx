import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { RiCloseLargeFill } from "react-icons/ri";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function ModalOverlay({ title, onClose, children, footer, cardClassName = "max-w-md", bodyClassName = "p-4" }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const previouslyFocused = document.activeElement;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll(FOCUSABLE);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const backdropMotion = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }
  };

  const cardMotion = shouldReduceMotion
    ? backdropMotion
    : {
      initial: { opacity: 0, scale: 0.96, y: 8 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.98, y: 4 },
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
    };

  return createPortal(
    <motion.div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      {...backdropMotion}
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        className={`w-full ${cardClassName}`}
        {...cardMotion}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <h5 id={titleId} className="text-lg font-bold">{title}</h5>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="m-1 rounded transition duration-200 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <RiCloseLargeFill />
            </button>
          </div>

          <div className={`flex-1 overflow-auto ${bodyClassName}`}>
            {children}
          </div>

          {footer && (
            <div className="flex justify-center border-t border-border p-4">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

ModalOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  footer: PropTypes.node,
  cardClassName: PropTypes.string,
  bodyClassName: PropTypes.string
};

export default ModalOverlay;
