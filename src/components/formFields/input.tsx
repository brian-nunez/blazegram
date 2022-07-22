import React from 'react';

type InputProps = {
  label: string | React.ReactNode;
  type?: 'text' | 'email' | 'date' | 'password' | 'textarea' | 'number' | 'tel' | 'url' | 'search' | 'time' | 'color' | 'hidden';
  name?: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  name,
  placeholder = '',
  onChange,
  maxLength,
  ...rest
}, ref) => {
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <input
        type={type}
        name={name}
        className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        placeholder={placeholder}
        onChange={onChange}
        maxLength={maxLength}
        ref={ref}
        {...rest}
      />
    </label>
  );
});

Input.displayName = 'Input';

export default Input;
