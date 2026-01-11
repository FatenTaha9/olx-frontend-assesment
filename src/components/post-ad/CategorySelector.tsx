// src/components/post-ad/CategorySelector.tsx

import React, { useState } from 'react';
import { Category } from '@/types/category';
import { useLanguage } from '@/hooks/useLanguage';
import styles from '@/styles/components/CategorySelector.module.css';

interface CategorySelectorProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  selectedCategory?: Category | null;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  const { t } = useLanguage();
  const [activeParent, setActiveParent] = useState<Category | null>(null);

  // Allowed categories that should show forms
  const ALLOWED_CATEGORIES = [
    'cars-for-sale',
    'apartments-villas-for-sale',
    'apartments-villas-for-rent',
    'commercial-for-sale',
    'commercial-for-rent',
    'land-for-sale'
  ];

  const handleParentClick = (category: Category) => {
    setActiveParent(category);
  };

  const handleChildClick = (child: Category) => {
    // Only allow selection of enabled categories
    if (ALLOWED_CATEGORIES.includes(child.slug)) {
      onSelectCategory(child);
    }
  };

  const isAllowedCategory = (slug: string) => {
    return ALLOWED_CATEGORIES.includes(slug);
  };

  return (
    <div className={styles.categorySelector}>
      <h2 className={styles.title}>{t('selectCategory')}</h2>
      
      <div className={styles.categoriesContainer}>
        {/* Left: Parent Categories */}
        <div className={styles.parentCategories}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleParentClick(category)}
              className={`${styles.parentButton} ${
                activeParent?.id === category.id ? styles.parentButtonActive : ''
              }`}
              type="button"
            >
              {category.name}
              <span className={styles.arrow}>›</span>
            </button>
          ))}
        </div>

        {/* Right: Child Categories */}
        <div className={styles.childCategories}>
          {activeParent && activeParent.children && activeParent.children.length > 0 ? (
            <>
              <h3 className={styles.childTitle}>{activeParent.name}</h3>
              <div className={styles.childList}>
                {activeParent.children.map((child) => {
                  const isAllowed = isAllowedCategory(child.slug);
                  return (
                    <button
                      key={child.id}
                      onClick={() => isAllowed && handleChildClick(child)}
                      className={`${styles.childButton} ${
                        selectedCategory?.id === child.id ? styles.childButtonSelected : ''
                      } ${!isAllowed ? styles.childButtonDisabled : ''}`}
                      type="button"
                      disabled={!isAllowed}
                    >
                      {child.name}
                      {!isAllowed && (
                        <span className={styles.comingSoon}>(Coming Soon)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>{t('selectCategory')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};