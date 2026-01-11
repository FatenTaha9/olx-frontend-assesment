import React from 'react';
import { CategoryField } from '@/types/category';
import { useLanguage } from '@/hooks/useLanguage';
import styles from '@/styles/components/FormField.module.css';
import SingleSelect from './SingleSelect';
import MultipleSelect from './MultipleSelect';
import NumberInput from './NumberInput';
import TextInput from './TextInput';

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

  if (field.roles.includes('exclude_from_post_an_ad')) {
    return null;
  }

  const renderField = () => {
    if (field.valueType === 'enum' && field.filterType === 'single_choice' && field.choices) {
      return (
        <SingleSelect
          id={field.attribute}
          value={value as string}
          onChange={(newValue) => {
            onChange(newValue);
          }}
          choices={(field.choices || []).map((choice) => ({
            id: String(choice.id),
            value: choice.value,
            label: choice.label,
          }))}
          isSearchable={field.roles.includes('searchable')}
          placeholder={t('selectPlaceholder')}
          required={field.isMandatory}
        />
      );
    }

    if (field.valueType === 'enum' && field.filterType === 'multiple_choice' && field.choices) {
      return (
        <MultipleSelect
          id={field.attribute}
          value={value as string[]}
          onChange={(newValues) => onChange(newValues)}
          choices={(field.choices || []).map((choice) => ({
            id: String(choice.id),
            value: choice.value,
            label: choice.label,
          }))}
          isSearchable={field.roles.includes('searchable')}
          required={field.isMandatory}
        />
      );
    }

    if ((field.valueType === 'integer' || field.valueType === 'float') && field.filterType === 'range') {
      return (
        <NumberInput
          id={field.attribute}
          value={value as number}
          onChange={(newValue) => onChange(newValue)}
          min={field.minValue ?? undefined}
          max={field.maxValue ?? undefined}
          step={field.valueType === 'float' ? 0.01 : 1}
          placeholder={`Enter ${field.name.toLowerCase()}`}
          required={field.isMandatory}
        />
      );
    }

    if (field.valueType === 'string') {
      return (
        <TextInput
          id={field.attribute}
          value={value as string}
          onChange={(newValue) => onChange(newValue)}
          maxLength={field.maxLength ?? undefined}
          placeholder={`Enter ${field.name.toLowerCase()}`}
          required={field.isMandatory}
          rows={field.maxLength && field.maxLength > 100 ? 4 : 1}
        />
      );
    }

    return (
      <TextInput
        id={field.attribute}
        value={value as string}
        onChange={(newValue) => onChange(newValue)}
        placeholder={`Enter ${field.name.toLowerCase()}`}
        required={field.isMandatory}
      />
    );
  };

  return (
    <div className={styles.fieldRow}>
      <label htmlFor={field.attribute} className={styles.fieldLabel}>
        {field.name}
        {field.isMandatory && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.fieldInput}>
        {renderField()}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
};