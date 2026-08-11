import PropTypes from "prop-types";

import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

function SubmitPosterButton({ isSubmiting, disabled = false }) {
  return (
    <div className="flex justify-center">
      {isSubmiting ? (
        <Button
          type="submit"
          disabled
          text={<Spinner label="Criando cartazes" className="mx-8" />}
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
