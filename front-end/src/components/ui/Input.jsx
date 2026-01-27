function Input({ type, placeholder, name, onChange, accept, step, register, validation, className }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      accept={accept}
      step={step}
      {...register(name, validation)}
      className={`flex-1 py-2 px-6 outline-none bg-transparent text-gray-100 placeholder-gray-300 border-2 hover:border-blue-300 focus:border-blue-300 transition rounded-lg ${className}`}
    />);
}

export default Input;