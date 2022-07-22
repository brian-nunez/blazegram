import React from 'react';

type TextAreaProps = {
  label: string | React.ReactNode;
  name?: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  name,
  value,
  onChange,
  ...rest
}, ref) => {
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <textarea
        name={name}
        className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        onChange={onChange}
        ref={ref}
        {...rest}
      />
    </label>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
