import { RiCloseLargeFill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import FormButton from "../ui/Button";

function HelpModal({ fileDownloadPath, imagePath, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-card-foreground">
      <div className="relative mx-auto w-11/12 max-w-md rounded-lg border border-border bg-card shadow-md">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h5 className="text-lg font-bold">Layout de importação</h5>
          <RiCloseLargeFill
            onClick={onClose}
            className="m-1 cursor-pointer duration-200 hover:text-secondary"
          />
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
      </div>
    </div>
  );
}

export default HelpModal;
