import PropTypes from "prop-types";

const BASE_CLASS = "flex items-center justify-center rounded-lg border px-6 py-3 font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const VARIANT_CLASS = {
  primary: "border-transparent bg-primary text-primary-foreground shadow-lg hover:bg-secondary hover:text-secondary-foreground",
  secondary: "border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
};

const DISABLED_CLASS = "cursor-not-allowed border-transparent bg-muted text-muted-foreground shadow-none";

function Button({ type = "button", text, disabled = false, onClick, variant = "primary", className = "" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BASE_CLASS} ${disabled ? DISABLED_CLASS : VARIANT_CLASS[variant]} ${className}`}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  text: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string
};

export default Button;
