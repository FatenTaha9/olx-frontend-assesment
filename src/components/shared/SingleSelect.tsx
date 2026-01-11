import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from '@/styles/components/SingleSelect.module.css';

interface Choice {
    id: string;
    value: string;
    label: string;
}

interface SingleSelectProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    choices: Choice[];
    isSearchable?: boolean;
    placeholder?: string;
    required?: boolean;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
    id,
    value,
    onChange,
    choices,
    isSearchable = false,
    placeholder,
    required,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for handling outside click

    // Filter the choices based on the search query
    const filteredChoices = useMemo(() => {
        if (!isSearchable || !searchQuery) return choices;
        return choices.filter((choice) =>
            choice.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [choices, searchQuery, isSearchable]);

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setSearchQuery('');
        setIsOpen(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); // Toggle dropdown only for this field
    };

    const closeDropdown = () => {
        setIsOpen(false);
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

    const getSelectedValue = () => {
        // Find the corresponding slug for the selected value (if it exists in choices)
        const selected = choices.find((choice) => choice.value === value);
        return selected ? selected.label : '';
    };

    return (
        <div className={styles.singleSelectContainer} ref={dropdownRef}>
            <div
                className={`${styles.dropdown} ${isOpen ? styles.active : ''}`}
                onClick={toggleDropdown}
            >
                <span className={styles.dropdownIcon}>🔍</span>
                <span className={styles.dropdownPlaceholder}>
                    {getSelectedValue() || placeholder || 'Select an option'}
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
                                className={styles.dropdownItem}
                                onClick={() => handleSelect(choice.value)} // Pass the value as the selected value
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

export default SingleSelect;