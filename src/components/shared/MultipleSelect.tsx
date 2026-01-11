import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from '@/styles/components/MultipleSelect.module.css';

interface Choice {
  id: string;
  value: string;
  label: string;
}

interface MultipleSelectProps {
  id: string;
  value: string[]; // Selected values
  onChange: (values: string[]) => void; // Callback function for changes
  choices: Choice[];
  isSearchable?: boolean;
  required?: boolean;
}

const MultipleSelect: React.FC<MultipleSelectProps> = ({
  id,
  value,
  onChange,
  choices,
  isSearchable = false,
  required,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Handles dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for handling outside click


  // Filter the choices based on the search query
  const filteredChoices = useMemo(() => {
    if (!isSearchable || !searchQuery) return choices;
    return choices.filter((choice) =>
      choice.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [choices, searchQuery, isSearchable]);

  const toggleDropdown = () => setIsOpen((prev) => !prev); // Toggle dropdown visibility

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const getSelectedValues = () => {
    // Return a comma-separated string of labels for all values in the array
    return value
      .map((val) => {
        const selected = choices.find((choice) => choice.value === val);
        return selected ? selected.label : ''; // Find matching labels
      })
      .filter((label) => label !== '') // Filter out any non-matching labels
      .join(', '); // Join the labels with a comma
  };

  const handleSelect = (selectedValue: string) => {
    const updatedValues = value.includes(selectedValue)
      ? value.filter((val) => val !== selectedValue) // Remove if already selected
      : [...value, selectedValue]; // Add if not yet selected

    onChange(updatedValues); // Pass updated values to parent
  };


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.multipleSelectContainer} ref={dropdownRef}>
      <div
        className={`${styles.dropdown}`}
        onClick={toggleDropdown}
      >
        <span className={styles.dropdownIcon}>🔍</span>
        <span className={styles.dropdownPlaceholder}>
          {value.length > 0 ? getSelectedValues() : 'Select options'}
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {isSearchable && (
            <input
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
            />
          )}
          <ul className={styles.dropdownList}>
            {filteredChoices.map((choice) => (
              <li
                key={choice.id}
                className={`${styles.dropdownItem} ${value.includes(choice.value) ? styles.selected : ''
                  }`}
                onClick={() => handleSelect(choice.value)}
              >
                {choice.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultipleSelect;