function Button({ type, text, disabled, href, onClick }) {
  return (
    <button
      type={type}
      disabled={disabled}
      href={href}
      onClick={onClick}
      className={`flex items-center justify-center m-auto text-gray-100 px-6 py-3 rounded-lg shadow-lg font-semibold
        ${disabled
          ? 'bg-blue-200 cursor-not-allowed'
          : 'bg-blue-300 hover:bg-blue-200 duration-200'
        }`}
    >
      {text}
    </button>
  );
}

export default Button;
