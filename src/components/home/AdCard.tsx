/* eslint-disable @next/next/no-img-element */
// src/components/home/AdCard.tsx

import React from 'react';
import { BaseAd, CarAd, adsTypes, PropertyAd, MobileAd } from '@/types/ad';
import { useLanguage } from '@/hooks/useLanguage';
import styles from '@/styles/components/AdCard.module.css';

interface AdCardProps {
  ad: CarAd | PropertyAd | MobileAd;
  type?: adsTypes;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { t } = useLanguage();

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>

        <img
          src={ad.ad_image_url}
          alt='img'
          className={styles.image}
        />

      </div>

      <div className={styles.content}>

        <div className={styles.price}>
          USD  {ad.ad_price}
        </div>

        <h3 className={styles.title}>{ad.client_device_description}</h3>

{/* 
        <div className={styles.location}>
          {ad.location.region}, {ad.location.city}
        </div>

        <div className={styles.meta}>
          <span className={styles.category}>{ad.category.name}</span>
          <span className={styles.date}>
            {new Date(ad.createdAt).toLocaleDateString()}
          </span>
        </div> */}
      </div>
    </div>
  );
};