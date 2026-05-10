"use client";
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import styles from './BestSellers.module.css';
import { Eye } from 'lucide-react';

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Τραβάμε 12 για να έχουμε περιθώριο για το shuffle
      const query = `*[_type == "product"][0...12] {
        _id,
        name,
        "slug": slug.current,
        price,
        shortDescription,
        "imageUrl": mainImage.asset->url
      }`;

      try {
        const data = await client.fetch(query);
        // Ανακατεύουμε τα προϊόντα και επιλέγουμε τα πρώτα 6
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 6);
        setProducts(shuffled);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Προτεινόμενα Προϊόντα</h2>
          <div className={styles.underline}></div>
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product._id} className={styles.card}>
              <Link href={`/product/${product.slug}`} className={styles.imageWrapper}>
                <img 
                  src={product.imageUrl || '/placeholder.jpg'} 
                  alt={product.name} 
                  className={styles.image}
                  loading="lazy"
                />
              </Link>
              
              <div className={styles.info}>
                <h3 className={styles.productName}>{product.name}</h3>
                
                <p className={styles.shortDesc}>
                  {product.shortDescription || "Χειροποίητο μοναστηριακό προϊόν εξαιρετικής ποιότητας."}
                </p>

                {/* Εμφάνιση τιμής μόνο με αριθμό και κόμμα */}
                <p className={styles.price}>
                  {product.price ? product.price.toFixed(2).replace('.', ',') : "---"}
                </p>
                
                <Link href={`/product/${product.slug}`} className={styles.moreBtn}>
                  <Eye size={18} />
                  ΠΕΡΙΣΣΟΤΕΡΑ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}