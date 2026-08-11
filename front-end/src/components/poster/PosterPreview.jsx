import PropTypes from "prop-types";

import ModalOverlay from "../ui/ModalOverlay";

function PosterPreview({ url, onClose }) {
  return (
    <ModalOverlay
      title="Prévia dos cartazes"
      onClose={onClose}
      cardClassName="max-w-3xl"
      bodyClassName="p-0"
    >
      <object
        data={`${url}#view=FitH`}
        type="application/pdf"
        aria-label="Pré-visualização dos cartazes"
        className="h-[70vh] min-h-64 w-full bg-muted"
      >
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <p>Seu navegador não consegue exibir o PDF aqui.</p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="font-extrabold underline transition hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Abrir o PDF em nova aba
          </a>
        </div>
      </object>
    </ModalOverlay>
  );
}

PosterPreview.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PosterPreview;
