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
  // Show the initial tiles view (category cards with images) before the 2-column selector.
  const [showTiles, setShowTiles] = useState<boolean>(true);

  // Allowed categories that should show forms for now based on requirements 
  const ALLOWED_CATEGORIES = [
    'cars-for-sale',
    'apartments-villas-for-sale',
  ];

  const handleParentClick = (category: Category) => {
    setActiveParent(category);
    setShowTiles(false);
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

  // Recursive renderer for a list of categories cz some may have children too found in some objects
  // even though they are all empty arrays
  const CategoryList: React.FC<{ items: Category[]; level?: number }> = ({ items, level = 0 }) => {
    return (
      <>
        {items.map((item) => {
          const padding = {
            paddingLeft: `calc(var(--spacing-md) + ${level * 12}px)`
          };
          const hasChildren = !!(item.children && item.children.length > 0);
          if (hasChildren) {
            return (
              <div key={item.id}>
                <button
                  type="button"
                  className={`${styles.childButton} ${styles.childButtonDisabled}`}
                  disabled
                  style={padding}
                >
                  {item.name}
                </button>
                <div>
                  <CategoryList items={item.children!} level={level + 1} />
                </div>
              </div>
            );
          }

          // Leaf node — selectable (or disabled if not allowed)
          const allowed = isAllowedCategory(item.slug);
          return (
            <button
              key={item.id}
              onClick={() => allowed && handleChildClick(item)}
              className={`${styles.childButton} ${selectedCategory?.id === item.id ? styles.childButtonSelected : ''}
                } ${!allowed ? styles.childButtonDisabled : ''}`}
              type="button"
              disabled={!allowed}
              style={padding}
            >
              {item.name}
              {!allowed && <span className={styles.comingSoon}>(Coming Soon)</span>}
            </button>
          );
        })}
      </>
    );
  };

  // Render a tiles/grid view for top-level categories
  const TilesView = () => (
    <div className={styles.categoryTilesContainer}>
      <div className={styles.categoryTilesGrid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={styles.categoryCard}
            onClick={() => handleParentClick(cat)}
          >
            <div className={styles.categoryCardImage} aria-hidden>
              {/* no image found per category object */}
            </div>
            <div className={styles.categoryCardTitle}>{cat.name}</div>
            <span className={styles.categoryCardArrow}>›</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.categorySelector}>
      <h2 className={styles.selectorTitle}>{t('selectCategory')}</h2>

      {showTiles ? (
        <TilesView />
      ) : (
        <div className={styles.categoriesContainer}>
          <div className={styles.parentCategories}>
            <div className={styles.parentHeaderControls}>
              <button
                type="button"
                className={styles.backToTiles}
                onClick={() => {
                  setShowTiles(true);
                  setActiveParent(null);
                }}
              >
                ← {t('backToCategories') || 'Back'}
              </button>
            </div>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleParentClick(category)}
                className={`${styles.parentButton} ${activeParent?.id === category.id ? styles.parentButtonActive : ''}`}
                type="button"
              >
                {category.name}
                <span className={styles.arrow}>›</span>
              </button>
            ))}
          </div>

          <div className={styles.childCategories}>
            {activeParent && activeParent.children && activeParent.children.length > 0 ? (
              <>
                <h3 className={styles.childTitle}>{activeParent.name}</h3>
                <div className={styles.childList}>
                  <CategoryList items={activeParent.children} />
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>{t('selectCategory')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};