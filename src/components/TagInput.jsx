'use client';

import { useState } from 'react';

const VALIDATORS = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Email no valido',
  },
  url: {
    regex: /^https?:\/\/.+\..+/,
    errorMessage: 'URL no valida (debe empezar con https://)',
  },
  text: {
    regex: /^.+$/,
    errorMessage: 'Campo no puede estar vacio',
  },
};

export default function TagInput({
  value = [],
  onChange,
  placeholder = 'Escribe y presiona Enter...',
  type = 'text',
  label,
  helpText,
}) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const validate = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const validator = VALIDATORS[type] || VALIDATORS.text;
    if (!validator.regex.test(trimmed)) {
      setError(validator.errorMessage);
      return false;
    }

    if (value.includes(trimmed)) {
      setError('Ya esta agregado');
      return false;
    }

    setError('');
    return true;
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (validate(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
      setError('');
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
    if (event.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (error) setError('');
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Tags display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary-dark text-xs font-medium rounded-full border border-primary/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-0.5 hover:text-red-600 transition-colors focus:outline-none"
                aria-label={`Eliminar ${tag}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 bg-white border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary'
          }`}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors shrink-0"
        >
          Agregar
        </button>
      </div>

      {/* Error / Help text */}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {!error && helpText && (
        <p className="mt-1 text-xs text-slate-400">{helpText}</p>
      )}
    </div>
  );
}
