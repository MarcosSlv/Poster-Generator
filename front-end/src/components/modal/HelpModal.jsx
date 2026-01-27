import { RiCloseLargeFill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import FormButton from "../ui/Button";

function HelpModal({ fileDownloadPath, imagePath, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-gray-100">
      <div className="relative bg-gray-400 w-11/12 max-w-md mx-auto rounded-lg shadow-md shadow-gray-300">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-bold">Layout de importação</h5>
          <RiCloseLargeFill
            onClick={onClose}
            className="m-1 hover:text-blue-200 duration-200"
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
              className="flex items-center justify-center text-gray-100 px-6 py-3 rounded-lg shadow-lg font-semibold bg-blue-300 hover:bg-blue-200 duration-200"
            >
              <MdDownload className="mr-1 text-xl" />
            </a>
          </div>
        </div>
        <div className="flex justify-center p-4 border-t border-gray-300">
          <FormButton
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={onClose}
            text={"Ok, entendi."}
          />
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
