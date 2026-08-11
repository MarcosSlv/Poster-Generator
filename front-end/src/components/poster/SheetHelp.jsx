import { useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";

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
          <motion.div
            key="modal"
            className="fixed inset-0 z-40 flex justify-center items-center backdrop-blur-md"
            initial={{ opacity: 0, scale: 0, y: -50, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
            animate={{ opacity: 1, scale: 1, y: 0, boxShadow: "0px 30px 60px rgba(0,0,0,1)" }}
            exit={{ opacity: 0, scale: 0, y: 50, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <HelpModal
              fileDownloadPath={fileDownloadPath}
              imagePath={imagePath}
              onClose={() => setIsModalOpen(false)}
            />
          </motion.div>
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
