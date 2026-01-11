// src/components/layout/Header.tsx

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import styles from '@/styles/components/Header.module.css';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            OLX
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              {t('home')}
            </Link>
            <Link href="/post-ad" className={styles.navLink}>
              {t('postAd')}
            </Link>
          </nav>

          <div className={styles.langSwitcher}>
            <button 
              onClick={() => setLanguage('en')}
              className={`${styles.langButton} ${language === 'en' ? styles.langButtonActive : ''}`}
              aria-label="Switch to English"
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('ar')}
              className={`${styles.langButton} ${language === 'ar' ? styles.langButtonActive : ''}`}
              aria-label="Switch to Arabic"
            >
              العربية
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};