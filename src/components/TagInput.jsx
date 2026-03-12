'use client';

import { useState } from 'react';

const VALIDATORS = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Email no válido',
  },
  url: {
    regex: /^https?:\/\/.+\..+/,
    errorMessage: 'URL no válida (debe empezar con https://)',
  },
  text: {
    regex: /^.+$/,
    errorMessage: 'Campo no puede estar vacío',
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
      setError('Ya está agregado');
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
        <label className="block text-base font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-mono rounded-lg border border-slate-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                aria-label={`Eliminar ${tag}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 bg-white border rounded-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400 outline-none transition-colors ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400'
          }`}
        />
        <button
          type="button"
          onClick={addTag}
          className={`px-5 py-3 text-base font-medium rounded-lg transition-colors shrink-0 ${
            inputValue.trim().length > 0
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          Agregar
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
      {!error && helpText && (
        <p className="mt-1.5 text-sm text-slate-400">{helpText}</p>
      )}
    </div>
  );
}
