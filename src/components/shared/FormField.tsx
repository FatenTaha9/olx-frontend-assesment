
import React from 'react';
import { CategoryField } from '@/types/category';
import { useLanguage } from '@/hooks/useLanguage';
import styles from '@/styles/components/FormField.module.css';

interface FormFieldProps {
  field: CategoryField;
  value: string | number | string[] | boolean;
  onChange: (value: string | number | string[] | boolean) => void;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const { t } = useLanguage();

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            className={styles.input}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            className={styles.input}
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            className={styles.textarea}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            className={styles.select}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          >
            <option value="">{t('selectPlaceholder')}</option>
            {field.choices?.map((choice) => (
              <option key={choice.id} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={styles.radioGroup}>
            {field.choices?.map((choice) => (
              <label key={choice.id} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={field.id}
                  value={choice.value}
                  checked={value === choice.value}
                  onChange={(e) => onChange(e.target.value)}
                  className={styles.radioInput}
                  required={field.required}
                />
                <span>{choice.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={styles.checkboxGroup}>
            {field.choices?.map((choice) => (
              <label key={choice.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={choice.value}
                  checked={(value as string[]).includes(choice.value)}
                  onChange={(e) => {
                    const currentValues = value as string[];
                    if (e.target.checked) {
                      onChange([...currentValues, choice.value]);
                    } else {
                      onChange(currentValues.filter((v) => v !== choice.value));
                    }
                  }}
                  className={styles.checkboxInput}
                />
                <span>{choice.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className={styles.rangeContainer}>
            <input
              type="range"
              id={field.id}
              className={styles.range}
              value={value as number}
              onChange={(e) => onChange(Number(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
              required={field.required}
            />
            <span className={styles.rangeValue}>{value}</span>
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            className={styles.input}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className={styles.fieldWrapper}>
      <label htmlFor={field.id} className={styles.label}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>
      {renderField()}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};