import { useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";

import HelpModal from "../modal/HelpModal";

function SheetHelp({ imagePath, fileDownloadPath }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="my-2 flex justify-center py-2 text-card-foreground">
        <p className="form-label-custom fs-2">
          Dúvidas quanto ao modelo da planilha?{" "}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="p-0 font-extrabold underline transition hover:cursor-pointer hover:text-secondary hover:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Veja aqui
          </button>
        </p>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <HelpModal
            key="help-modal"
            fileDownloadPath={fileDownloadPath}
            imagePath={imagePath}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

SheetHelp.propTypes = {
  imagePath: PropTypes.string.isRequired,
  fileDownloadPath: PropTypes.string.isRequired
};

export default SheetHelp;
