"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import QuickView from '@/components/QuickView/QuickView';

export default function ProductCard({ product }: { product: any }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Διόρθωση για το slug: αν είναι αντικείμενο παίρνουμε το .current, αν είναι string το κρατάμε
  const productSlug = product?.slug?.current || product?.slug;
  
  // Διόρθωση για τον τίτλο: αν δεν υπάρχει title (από το search), δοκιμάζουμε το name
  const productTitle = product?.title || product?.name;

  const getPrice = () => {
    const base = Number(product?.price) || 0;
    const vPrices = (product?.variants || [])
      .map((v: any) => Number(v?.variantPrice || 0))
      .filter((p: number) => p > 0);

    const all = base > 0 ? [base, ...vPrices] : vPrices;

    if (all.length === 0) return "5,00 € - 90,00 €"; 

    const min = Math.min(...all);
    const max = Math.max(...all);

    return min === max 
      ? `${min.toFixed(2).replace('.', ',')} €` 
      : `${min.toFixed(2).replace('.', ',')} € - ${max.toFixed(2).replace('.', ',')} €`;
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          {/* Χρήση του productSlug που καθαρίσαμε παραπάνω */}
          <Link href={`/product/${productSlug}`}>
            <img 
              src={product?.imageUrl || '/placeholder.jpg'} 
              alt={productTitle} 
              className={styles.image} 
            />
          </Link>
          <button 
            className={styles.quickViewBtn} 
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
          >
            ΓΡΗΓΟΡΗ ΜΑΤΙΑ
          </button>
        </div>

        <div className={styles.content}>
          <Link href={`/product/${productSlug}`} className={styles.title}>
            {productTitle}
          </Link>
          
          {product?.shortDesc && (
            <p className={styles.shortDescription}>
              {product.shortDesc.length > 80 
                ? `${product.shortDesc.substring(0, 80)}...` 
                : product.shortDesc}
            </p>
          )}
          
          <div className={styles.priceRange}>
            {getPrice()}
          </div>
          
          <div className={styles.stockInfo}>
            <span className={styles.dot}></span> In Stock
          </div>
        </div>
      </div>

      {isQuickViewOpen && (
        <QuickView product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}