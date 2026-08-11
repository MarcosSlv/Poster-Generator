import PropTypes from "prop-types";
import { MdDownload } from "react-icons/md";

import FormButton from "../ui/Button";
import ModalOverlay from "../ui/ModalOverlay";

function HelpModal({ fileDownloadPath, imagePath, onClose }) {
  return (
    <ModalOverlay
      title="Layout de importação"
      onClose={onClose}
      footer={<FormButton type="button" className="px-4 py-2" onClick={onClose} text={"Ok, entendi."} />}
    >
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
    </ModalOverlay>
  );
}

HelpModal.propTypes = {
  fileDownloadPath: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default HelpModal;
