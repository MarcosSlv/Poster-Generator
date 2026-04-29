function Button({ type = "button", text, disabled, onClick, className = "" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`m-auto flex items-center justify-center rounded-lg border border-transparent px-6 py-3 font-semibold shadow-lg transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${disabled
        ? "cursor-not-allowed bg-muted text-muted-foreground shadow-none"
        : "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
        } ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;
