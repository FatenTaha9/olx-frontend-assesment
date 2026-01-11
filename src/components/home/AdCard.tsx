/* eslint-disable @next/next/no-img-element */
// src/components/home/AdCard.tsx

import React, { useState } from 'react';
import { CarAd, adsTypes, PropertyAd, MobileAd } from '@/types/ad';
import { useLanguage } from '@/hooks/useLanguage';
import styles from '@/styles/components/AdCard.module.css';

interface AdCardProps {
  ad: CarAd | PropertyAd | MobileAd;
  type?: adsTypes;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { language, t } = useLanguage();

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() =>
    Math.floor(Date.now() / 1000)
  );

  const convertNumberToArabic = (number: number | string): string => {
    // Mapping of English digits to Arabic digits
    const englishToArabicMap: { [key: string]: string } = {
      "0": "٠",
      "1": "١",
      "2": "٢",
      "3": "٣",
      "4": "٤",
      "5": "٥",
      "6": "٦",
      "7": "٧",
      "8": "٨",
      "9": "٩"
    };

    // Convert the number to a string and replace each digit
    return number
      .toString()
      .split("") // Split the string into individual characters
      .map((digit) => englishToArabicMap[digit] || digit) // Map each digit to Arabic or leave non-numerics untouched
      .join(""); // Join the converted array back into a string
  }

  const formatNumber = (num: number): string => (language === 'ar' ? convertNumberToArabic(num) : num.toString());


  const timeSince = (
    timestamp: number,
    currentTime: number,
  ): string => {
    const secondsAgo = currentTime - timestamp;

    let timeString: string;

    if (secondsAgo < 60) {
      timeString = `${formatNumber(secondsAgo)} ${t('second')}${secondsAgo === 1 ? '' : t('s')}`;
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      timeString = `${formatNumber(minutesAgo)} ${t('minute')}${minutesAgo === 1 ? '' : t('s')}`;
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      timeString = `${formatNumber(hoursAgo)} ${t('hour')}${hoursAgo === 1 ? '' : t('s')}`;
    } else {
      const daysAgo = Math.floor(secondsAgo / 86400);
      timeString = `${formatNumber(daysAgo)} ${t('day')}${daysAgo === 1 ? '' : t('s')}`;
    }

    // Adjust the "ago" string based on language direction
    return language === 'ar' ? `${t('ago')} ${timeString}` : `${timeString} ${t('ago')}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={ad.ad_image_url}
          alt="img"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.price}>
          USD {ad.ad_price}
        </div>

        <h3 className={styles.title}>{ad.ad_title}</h3>

        <div className={styles.location}>
          {language === 'en' ? ad.ad_location_name_en : ad.ad_location_name_lc}
        </div>

        <div>
          {ad.timestamp ? timeSince(ad.timestamp, currentTimestamp) : ''}
        </div>
      </div>
    </div>
  );
};