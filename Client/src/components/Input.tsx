import React from "react";

interface InputProps {
  id?: string;
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  type,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  disabled,
  required,
}) => {
  return (
    <input
      className="font-light px-4 py-2 w-full border-[1px] rounded-xl"
      id={id}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
    />
  );
};

export default Input;
