import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const baseClasses =
    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors";

  const stateClasses = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  const inputClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input id={inputId} className={inputClasses} {...props} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
