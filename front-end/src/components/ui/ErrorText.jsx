import PropTypes from "prop-types";

function ErrorText({ children, alert = false, className = "" }) {
  if (!children) {
    return null;
  }

  return (
    <p
      role={alert ? "alert" : undefined}
      className={`text-center text-sm font-bold text-destructive ${className}`}
    >
      {children}
    </p>
  );
}

ErrorText.propTypes = {
  children: PropTypes.node,
  alert: PropTypes.bool,
  className: PropTypes.string
};

export default ErrorText;
