// src/pages/post-ad.tsx

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CategorySelector } from '@/components/post-ad/CategorySelector';
import { FormField } from '@/components/shared/FormField';
import { useLanguage } from '@/hooks/useLanguage';
import { Category, CategoryField, FormData } from '@/types/category';
import { fetchCategories, fetchCategoryFields } from '@/utils/api';
import styles from '@/styles/pages/PostAd.module.css';

export default function PostAd() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewJson, setPreviewJson] = useState<string>('');

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryFields(selectedCategory.slug);
    }
  }, [selectedCategory]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setCategoriesLoading(true);
      try {
        const data = await fetchCategories();
        if (mounted) setCategories(data || []);
      } catch (err) {
        console.error('Client: error fetching categories', err);
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const loadCategoryFields = async (categorySlug: string) => {
    setLoading(true);
    try {
      const response = await fetchCategoryFields(categorySlug);
      console.log('Category Fields Response:', response);

      let extractedFields: CategoryField[] = [];

      // Try different response structures
      if (response.data && Array.isArray(response.data)) {
        extractedFields = response.data;
      } else if (Array.isArray(response)) {
        extractedFields = response;
      } else if (typeof response === 'object') {
        // Response is split by category IDs
        const firstKey = Object.keys(response)[0];
        if (firstKey && response[firstKey]) {
          if (response[firstKey].flatFields) {
            extractedFields = response[firstKey].flatFields;
          } else if (Array.isArray(response[firstKey])) {
            extractedFields = response[firstKey];
          }
        }
      }

      console.log('Extracted Fields:', extractedFields);
      setFields(extractedFields);

      // Initialize form data with default values
      const initialData: FormData = {};
      extractedFields.forEach((field) => {
        // Skip fields excluded from post an ad
        if (field.roles && field.roles.includes('exclude_from_post_an_ad')) {
          return;
        }
        
        // Use attribute as the key (like 'make', 'year', etc.)
        const fieldKey = field.attribute;
        
        if (field.valueType === 'enum_multiple' || 
            (field.valueType === 'enum' && field.filterType === 'multiple_choice')) {
          initialData[fieldKey] = [];
        } else if (field.valueType === 'integer' || field.valueType === 'float') {
          initialData[fieldKey] = field.minValue || 0;
        } else {
          initialData[fieldKey] = '';
        }
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error loading category fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setFields([]);
    setFormData({});
    setErrors({});
  };

  const handleFieldChange = (fieldAttribute: string, value: string | number | string[] | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldAttribute]: value,
    }));

    // Clear error for this field
    if (errors[fieldAttribute]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldAttribute];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    fields.forEach((field) => {
      // Skip fields excluded from post an ad
      if (field.roles && field.roles.includes('exclude_from_post_an_ad')) {
        return;
      }
      
      if (field.isMandatory) {
        const value = formData[field.attribute];

        if (
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field.attribute] = `${field.name} ${t('required')}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // prepare preview JSON and open dialog instead of submitting
      const json = JSON.stringify(formData, null, 2);
      setPreviewJson(json);
      setPreviewOpen(true);
      console.log('Form Data (preview):', formData);
    }
  };

  const handleChangeCategory = () => {
    setSelectedCategory(null);
    setFields([]);
    setFormData({});
    setErrors({});
  };

  return (
    <Layout>
      <div className={styles.postAd}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>{t('postAd')}</h1>
            </div>
            {!selectedCategory ? (
              categoriesLoading ? (
                <div className={styles.loading}>
                  {t('loadingCategories') || 'Loading categories...'}
                </div>
              ) : (
                <CategorySelector
                  categories={categories}
                  onSelectCategory={handleCategorySelect}
                  selectedCategory={selectedCategory}
                />
              )
            ) : (
              <div className={styles.formContainer}>
                <div className={styles.selectedCategoryHeader}>
                  <div>
                    <p className={styles.selectedCategoryLabel}>
                      {t('selectedCategory')}:
                    </p>
                    <h2 className={styles.selectedCategoryName}>
                      {selectedCategory.name}
                    </h2>
                  </div>
                  <button
                    onClick={handleChangeCategory}
                    className={styles.changeCategoryButton}
                    type="button"
                  >
                    {t('changeCategory')}
                  </button>
                </div>

                {loading ? (
                  <div className={styles.loading}>{t('loadingFields')}</div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formFields}>
                      {fields
                        .filter(f => !f.roles.includes('exclude_from_post_an_ad'))
                        .sort((a, b) => a.displayPriority - b.displayPriority)
                        .map((field) => (
                          <FormField
                            key={field.id}
                            field={field}
                            value={formData[field.attribute] ?? ''}
                            onChange={(value: string | number | boolean | string[]) => handleFieldChange(field.attribute, value)}
                            error={errors[field.attribute]}
                          />
                        ))}
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        onClick={handleChangeCategory}
                        className={styles.cancelButton}
                      >
                        {t('cancel')}
                      </button>
                      <button type="submit" className={styles.submitButton}>
                        {t('submit')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 16,
          }}
          onClick={() => setPreviewOpen(false)}
        >
          <div
            role="document"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 900,
              maxHeight: '80vh',
              background: 'var(--color-white)',
              borderRadius: 8,
              padding: 20,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{t('preview') || 'Preview'}</h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <pre
              style={{
                background: '#f6f7f8',
                padding: 12,
                borderRadius: 6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 13,
                maxHeight: '60vh',
                overflow: 'auto',
              }}
            >
              {previewJson}
            </pre>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(previewJson).catch(() => {});
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-white)',
                  cursor: 'pointer',
                }}
              >
                {t('copy') || 'Copy'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewOpen(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  cursor: 'pointer',
                }}
              >
                {t('close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}