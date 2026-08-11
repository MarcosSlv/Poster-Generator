import PropTypes from "prop-types";

function Input({ id, type, placeholder, name, accept, step, register, validation, className = "" }) {
  return (
    <input
      id={id ?? name}
      type={type}
      placeholder={placeholder}
      accept={accept}
      step={step}
      {...register(name, validation)}
      className={`flex-1 rounded-lg border border-border bg-input px-6 py-2 text-foreground outline-none transition placeholder:text-muted-foreground hover:border-secondary focus:border-ring focus:ring-1 focus:ring-ring ${className}`}
    />);
}

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string,
  step: PropTypes.string,
  register: PropTypes.func.isRequired,
  validation: PropTypes.object,
  className: PropTypes.string
};

export default Input;
