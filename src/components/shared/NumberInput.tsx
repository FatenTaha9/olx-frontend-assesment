import React from 'react';
import styles from '@/styles/components/NumberInput.module.css';

interface NumberInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  required,
}) => {
  return (
    <input
      type="number"
      id={id}
      className={styles.input}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default NumberInput;