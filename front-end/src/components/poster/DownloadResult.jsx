import { useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { MdDownload, MdVisibility } from "react-icons/md";

import Button from "../ui/Button";
import PosterPreview from "./PosterPreview";

function DownloadResult({ downloadUrl, message, onReset }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {downloadUrl && (
          <motion.div
            key="download-section"
            aria-live="polite"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="mt-4 text-center text-chart-3">{message}</p>

            <div className="mx-auto mt-4 grid w-full max-w-sm grid-cols-2 gap-3">
              <Button
                className="w-full"
                onClick={() => setIsPreviewOpen(true)}
                text={
                  <>
                    <MdVisibility className="mr-2 text-xl" />
                    Prévia
                  </>
                }
              />
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Baixar cartazes em PDF"
                className="flex"
              >
                <Button
                  className="w-full"
                  text={
                    <>
                      <MdDownload className="mr-2 text-xl" />
                      Baixar
                    </>
                  }
                />
              </a>
            </div>

            <div className="mt-3 flex justify-center">
              <Button variant="secondary" onClick={onReset} text="Criar outro cartaz" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreviewOpen && downloadUrl && (
          <PosterPreview
            key="poster-preview"
            url={downloadUrl}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

DownloadResult.propTypes = {
  downloadUrl: PropTypes.string,
  message: PropTypes.string,
  onReset: PropTypes.func.isRequired
};

export default DownloadResult;
