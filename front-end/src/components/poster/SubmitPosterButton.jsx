import PropTypes from "prop-types";

import Button from "../ui/Button";

function SubmitPosterButton({ isSubmiting, disabled = false }) {
  return (
    <div className="flex justify-center">
      {isSubmiting ? (
        <Button
          type="submit"
          disabled
          text={
            <span
              role="status"
              aria-label="Criando cartazes"
              className="mx-8 inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
            />
          }
        />
      ) : (
        <Button type="submit" text="Criar Cartaz" disabled={disabled} />
      )}
    </div>
  );
}

SubmitPosterButton.propTypes = {
  isSubmiting: PropTypes.bool,
  disabled: PropTypes.bool
};

export default SubmitPosterButton;
