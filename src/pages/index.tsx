// src/pages/index.tsx

import { GetServerSideProps } from 'next';
import { Layout } from '@/components/layout/Layout';
import { AdCard } from '@/components/home/AdCard';
import { useLanguage } from '@/hooks/useLanguage';
import { Ad } from '@/types/ad';
import { mockAds } from '@/constants/mockAds';
import styles from '@/styles/pages/Home.module.css';

interface HomeProps {
  ads: Ad;
}

export default function Home({ ads }: HomeProps) {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className={styles.home}>
        <div className="container">
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>
              {t('home')}
            </h1>
          </section>

          <section className={styles.adsSection}>
            <div className={styles.adsGrid}>
              {ads?.map((adType) => (
                adType.ads.map((ad, index) => (
                  <>
                  {index === 0 && (
                    <h2 key={adType.type} className={styles.adTypeHeader}>
                      {adType.type}
                    </h2>
                  )}
                    <AdCard key={ad.ad_external_id} ad={ad} />
                  </>
                ))
              ))}
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Simulate API call with Promise delay
  const ads = await new Promise<Ad>((resolve) => {
    setTimeout(() => {
      resolve(mockAds);
    }, 500);
  });

  return {
    props: {
      ads,
    },
  };
};