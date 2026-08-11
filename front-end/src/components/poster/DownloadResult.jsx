import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { MdDownload } from "react-icons/md";

import Button from "../ui/Button";

function DownloadResult({ downloadUrl, message, onReset }) {
  return (
    <AnimatePresence mode="wait">
      {downloadUrl && (
        <motion.div
          key="download-section"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div>
            <p className="mt-4 text-center text-chart-3">{message} Clique no botão abaixo para fazer o download</p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Baixar cartazes em PDF"
              className="flex items-center justify-center mt-4"
            >
              <Button text={<MdDownload className="mr-1 text-xl" />} />
            </a>
            <div className="text-center mt-4">
              <Button onClick={onReset} text="Criar outro cartaz" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DownloadResult.propTypes = {
  downloadUrl: PropTypes.string,
  message: PropTypes.string,
  onReset: PropTypes.func.isRequired
};

export default DownloadResult;
