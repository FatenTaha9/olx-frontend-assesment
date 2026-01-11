// src/components/layout/Layout.tsx

import React, { ReactNode } from 'react';
import { Header } from './Header';
import styles from '@/styles/components/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};