import React from 'react';
import styles from '@/styles/components/TextInput.module.css';

interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  rows?: number; // For supporting textarea when needed
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  maxLength,
  placeholder,
  required,
  rows = 1,
}) => {
  if (rows > 1) {
    // Render a textarea if rows > 1
    return (
      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    );
  }

  return (
    <input
      type="text"
      id={id}
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default TextInput;