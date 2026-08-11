import PropTypes from "prop-types";

function Spinner({ label, className = "" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent ${className}`}
    />
  );
}

Spinner.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Spinner;
