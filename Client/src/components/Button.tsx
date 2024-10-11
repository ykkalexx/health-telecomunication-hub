import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  className,
  disabled,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-indigo-500 w-full text-white font-light px-4 py-2 rounded-xl ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
