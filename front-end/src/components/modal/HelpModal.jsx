import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { RiCloseLargeFill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";

import FormButton from "../ui/Button";

function HelpModal({ fileDownloadPath, imagePath, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

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

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-card-foreground">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        className="relative mx-auto w-11/12 max-w-md rounded-lg border border-border bg-card shadow-md"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h5 id="help-modal-title" className="text-lg font-bold">Layout de importação</h5>
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
        <div className="p-4">
          <p>O arquivo a ser importado deverá ser um arquivo .csv ou .xlsx (Excel), contendo a estrutura abaixo:</p>
          <div className="overflow-auto mt-4">
            <img className="w-full" src={imagePath} alt="Modelo de tabela" />
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <p>Se desejar um modelo é só clicar:</p>
            <a
              href={fileDownloadPath}
              download={fileDownloadPath.split('/').pop()}
              aria-label="Baixar planilha modelo"
              className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg duration-200 hover:bg-secondary hover:text-secondary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <MdDownload className="mr-1 text-xl" />
            </a>
          </div>
        </div>
        <div className="flex justify-center border-t border-border p-4">
          <FormButton
            type="button"
            className="px-4 py-2"
            onClick={onClose}
            text={"Ok, entendi."}
          />
        </div>
      </div>
    </div>
  );
}

HelpModal.propTypes = {
  fileDownloadPath: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default HelpModal;
