function Input({ type, placeholder, name, onChange, accept, step, register, validation, className = "" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      accept={accept}
      step={step}
      {...register(name, validation)}
      className={`flex-1 rounded-lg border border-border bg-input px-6 py-2 text-foreground outline-none transition placeholder:text-muted-foreground hover:border-secondary focus:border-ring focus:ring-1 focus:ring-ring ${className}`}
    />);
}

export default Input;
