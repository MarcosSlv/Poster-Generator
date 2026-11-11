import { RiCloseLargeFill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import FormButton from "../ui/Button";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

function HelpModal({ fileDownloadPath, imagePath, onClose }) {
  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 text-card-foreground">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel className="relative mx-auto w-full max-w-md rounded-lg border border-border bg-card shadow-md">
        <div className="flex items-center justify-between border-b border-border p-4">
          <DialogTitle className="text-lg font-bold">Layout de importação</DialogTitle>
          <button type="button" onClick={onClose} aria-label="Fechar ajuda" className="p-2 hover:text-secondary"><RiCloseLargeFill aria-hidden="true" /></button>
        </div>
        <div className="p-4">
          <p>Selecione um arquivo .xls ou .xlsx (Excel), contendo a estrutura abaixo:</p>
          <div className="overflow-auto mt-4">
            <img className="w-full" src={imagePath} alt="Modelo de tabela" />
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <p>Se desejar um modelo é só clicar:</p>
            <a
              href={fileDownloadPath}
              download={fileDownloadPath.split('/').pop()}
              aria-label="Baixar planilha modelo"
              className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg duration-200 hover:bg-secondary hover:text-secondary-foreground"
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
      </DialogPanel>
      </div>
    </Dialog>
  );
}

export default HelpModal;
