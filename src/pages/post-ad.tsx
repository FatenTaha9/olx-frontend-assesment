// src/pages/post-ad.tsx

import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/layout/Layout';
import { CategorySelector } from '@/components/post-ad/CategorySelector';
import { FormField } from '@/components/shared/FormField';
import { useLanguage } from '@/hooks/useLanguage';
import { Category, CategoryField, FormData } from '@/types/category';
import { fetchCategories, fetchCategoryFields } from '@/utils/api';
import styles from '@/styles/pages/PostAd.module.css';

interface PostAdProps {
  categories: Category[];
}

export default function PostAd({ categories }: PostAdProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryFields(selectedCategory.slug);
    }
  }, [selectedCategory]);

  const loadCategoryFields = async (categorySlug: string) => {
    setLoading(true);
    try {
      const response = await fetchCategoryFields(categorySlug);
      
      // Log to debug
      console.log('Category Fields Response:', response);
      
      // The response structure varies, try to extract fields
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
          if (response[firstKey].fields) {
            extractedFields = response[firstKey].fields;
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
        if (field.type === 'checkbox') {
          initialData[field.name] = [];
        } else if (field.type === 'number' || field.type === 'range') {
          initialData[field.name] = field.min || 0;
        } else {
          initialData[field.name] = '';
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

  const handleFieldChange = (fieldName: string, value: string | number | string[] | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];
        
        if (
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field.name] = `${field.label} ${t('required')}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Ad submission is not required to work per PDF
      alert('Form is valid! (Submission not implemented as per requirements)');
      console.log('Form Data:', formData);
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
          <div className={styles.header}>
            <h1 className={styles.title}>{t('postAd')}</h1>
          </div>

          <div className={styles.content}>
            {!selectedCategory ? (
              <CategorySelector
                categories={categories}
                onSelectCategory={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
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
                      {fields.map((field) => (
                        <FormField
                          key={field.id}
                          field={field}
                          value={formData[field.name]}
                          onChange={(value) => handleFieldChange(field.name, value)}
                          error={errors[field.name]}
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
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categories = await fetchCategories();
    return {
      props: {
        categories: categories || [],
      },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: [],
      },
    };
  }
};