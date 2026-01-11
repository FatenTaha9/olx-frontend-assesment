// src/components/post-ad/FormField.tsx

import React, { useState, useMemo } from 'react';
import { CategoryField, FieldChoice } from '@/types/category';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Filter choices based on search query
  const filteredChoices = useMemo(() => {
    if (!field.choices || !searchQuery) return field.choices;
    
    return field.choices.filter(choice => 
      choice.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [field.choices, searchQuery]);

  // Skip fields that should be excluded from post an ad
  if (field.roles.includes('exclude_from_post_an_ad')) {
    return null;
  }

  const isSearchable = field.roles.includes('searchable');

  const renderField = () => {
    // ENUM with single_choice = SELECT dropdown (possibly searchable)
    if (field.valueType === 'enum' && field.filterType === 'single_choice' && field.choices) {
      if (isSearchable) {
        // Searchable dropdown
        return (
          <div className={styles.searchableSelect}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={`Search for ${field.name.toLowerCase()}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              id={field.attribute}
              className={styles.select}
              value={value as string}
              onChange={(e) => {
                onChange(e.target.value);
                setSearchQuery('');
              }}
              required={field.isMandatory}
              size={5}
            >
              <option value="">{t('selectPlaceholder')}</option>
              {(filteredChoices || []).map((choice) => (
                <option key={choice.id} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>
        );
      }
      
      // Regular dropdown
      return (
        <select
          id={field.attribute}
          className={styles.select}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          required={field.isMandatory}
        >
          <option value="">{t('selectPlaceholder')}</option>
          {field.choices.map((choice) => (
            <option key={choice.id} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      );
    }

    // ENUM with multiple_choice = MULTI-SELECT dropdown
    if (field.valueType === 'enum' && field.filterType === 'multiple_choice' && field.choices) {
      const selectedValues = Array.isArray(value) ? value : [];
      
      if (isSearchable) {
        // Searchable multi-select
        return (
          <div className={styles.searchableSelect}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={`Search for ${field.name.toLowerCase()}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              id={field.attribute}
              className={styles.select}
              multiple
              value={selectedValues}
              onChange={(e) => {
                const options = Array.from(e.target.options);
                const values = options
                  .filter(option => option.selected)
                  .map(option => option.value);
                onChange(values);
              }}
              required={field.isMandatory && selectedValues.length === 0}
              size={5}
            >
              {(filteredChoices || []).map((choice) => (
                <option key={choice.id} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
            <p className={styles.multiSelectHint}>Hold Ctrl/Cmd to select multiple</p>
          </div>
        );
      }

      // Regular multi-select dropdown
      return (
        <div>
          <select
            id={field.attribute}
            className={styles.select}
            multiple
            value={selectedValues}
            onChange={(e) => {
              const options = Array.from(e.target.options);
              const values = options
                .filter(option => option.selected)
                .map(option => option.value);
              onChange(values);
            }}
            required={field.isMandatory && selectedValues.length === 0}
            size={5}
          >
            {field.choices.map((choice) => (
              <option key={choice.id} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
          <p className={styles.multiSelectHint}>Hold Ctrl/Cmd to select multiple</p>
        </div>
      );
    }

    // ENUM_MULTIPLE with choice groups = RADIO BUTTONS or CHECKBOXES
    // Based on the image, "Ownership" uses radio buttons (single choice from multiple options)
    if (field.valueType === 'enum_multiple' && field.choiceGroups) {
      const selectedValues = Array.isArray(value) ? value : [];
      
      return (
        <div className={styles.groupedOptions}>
          {Object.values(field.choiceGroups)
            .sort((a, b) => a.displayPriority - b.displayPriority)
            .map((group) => (
              <div key={group.id} className={styles.optionGroup}>
                <h4 className={styles.groupLabel}>{group.label}</h4>
                <div className={styles.radioGroup}>
                  {group.choices.all.map((choice) => (
                    <label key={choice.id} className={styles.radioLabel}>
                      <input
                        type="checkbox"
                        value={choice.value}
                        checked={selectedValues.includes(choice.value)}
                        onChange={(e) => {
                          const currentValues = selectedValues;
                          if (e.target.checked) {
                            onChange([...currentValues, choice.value]);
                          } else {
                            onChange(currentValues.filter((v) => v !== choice.value));
                          }
                        }}
                        className={styles.radioInput}
                      />
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>
      );
    }

    // INTEGER or FLOAT with range = NUMBER INPUT
    if ((field.valueType === 'integer' || field.valueType === 'float') && field.filterType === 'range') {
      return (
        <input
          type="number"
          id={field.attribute}
          className={styles.input}
          value={value as number}
          onChange={(e) => onChange(field.valueType === 'integer' ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0)}
          min={field.minValue ?? undefined}
          max={field.maxValue ?? undefined}
          step={field.valueType === 'float' ? '0.01' : '1'}
          placeholder={`Enter ${field.name.toLowerCase()}`}
          required={field.isMandatory}
        />
      );
    }

    // STRING = TEXT INPUT
    if (field.valueType === 'string') {
      // If maxLength is large, use textarea
      if (field.maxLength && field.maxLength > 100) {
        return (
          <textarea
            id={field.attribute}
            className={styles.textarea}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.maxLength}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.isMandatory}
            rows={4}
          />
        );
      }
      
      return (
        <input
          type="text"
          id={field.attribute}
          className={styles.input}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          maxLength={field.maxLength ?? undefined}
          placeholder={`Enter ${field.name.toLowerCase()}`}
          required={field.isMandatory}
        />
      );
    }

    // Fallback to text input
    return (
      <input
        type="text"
        id={field.attribute}
        className={styles.input}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
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