'use client';

import React, { useState } from 'react';
import { FormInputConfig, FormButtonConfig } from '@/lib/config/types';

/**
 * Universal Form Element Component
 * Renders any form input based on JSON configuration
 * Supports: text, email, password, textarea, select, checkbox, radio
 */

export interface FormElementProps extends FormInputConfig {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const FormElement: React.FC<FormElementProps> = ({
  type,
  inputType,
  name,
  label,
  placeholder,
  required,
  validation,
  options = [],
  defaultValue = '',
  className = '',
  errorMessage,
  value,
  onChange,
  onBlur,
}) => {
  const [error, setError] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    // Validation
    if (validation && newValue) {
      const regex = new RegExp(validation);
      if (!regex.test(newValue)) {
        setError(errorMessage || 'Invalid format');
      } else {
        setError('');
      }
    }

    onChange?.(newValue);
  };

  const baseInputClass = `
    w-full px-4 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `;

  // Text Input
  if (inputType === 'text' || inputType === 'email' || inputType === 'password' || 
      inputType === 'number' || inputType === 'tel' || inputType === 'url' || inputType === 'date') {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={currentValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          className={baseInputClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && (
          <p id={`${name}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Textarea
  if (inputType === 'textarea') {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          value={currentValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          className={`${baseInputClass} resize-none min-h-[120px]`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && (
          <p id={`${name}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Select
  if (inputType === 'select') {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={name}
          name={name}
          value={currentValue}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          className={baseInputClass}
          aria-invalid={!!error}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Checkbox
  if (inputType === 'checkbox') {
    return (
      <div className="flex flex-col gap-3 w-full">
        {label && (
          <span className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                value={opt.value}
                checked={currentValue.includes(opt.value)}
                onChange={handleChange}
                className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Radio
  if (inputType === 'radio') {
    return (
      <div className="flex flex-col gap-3 w-full">
        {label && (
          <span className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={currentValue === opt.value}
                onChange={handleChange}
                className="w-4 h-4 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // File Input
  if (inputType === 'file') {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={name}
          name={name}
          type="file"
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          className={`${baseInputClass} file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && (
          <p id={`${name}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  return null;
};

/**
 * Universal Form Button Component
 * Renders button based on JSON configuration
 */
export interface FormButtonProps extends Omit<FormButtonConfig, 'onClick'> {
  onClick?: () => void;
  loading?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  loading = false,
}) => {
  const baseClass = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} disabled:cursor-not-allowed`}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin">⚙️</span>
          {label}
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
};
