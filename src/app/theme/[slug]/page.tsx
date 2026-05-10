import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import styles from './ThemePage.module.css';

const themeMap: { [key: string]: { title: string, sanityValue: string } } = {
  christos: { title: 'Χριστός', sanityValue: 'christos' },
  panagia: { title: 'Παναγία', sanityValue: 'panagia' },
  agioi: { title: 'Άγιοι', sanityValue: 'agioi' },
  parastaseis: { title: 'Παραστάσεις', sanityValue: 'parastaseis' }
};

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Λήψη του slug (με await για συμβατότητα με Next.js 15+)
  const { slug } = await params;
  const currentTheme = themeMap[slug];
  const sanitySearchValue = currentTheme ? currentTheme.sanityValue : slug;

  // 2. Query στο Sanity
  const query = `*[_type == "product" && theme == $searchValue] {
    _id,
    name,
    "slug": slug.current,
    price,
    shortDescription,
    "imageUrl": mainImage.asset->url
  }`;

  const products = await client.fetch(query, { searchValue: sanitySearchValue }, { cache: 'no-store' });

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{currentTheme ? currentTheme.title : slug}</h1>
        <div className={styles.underline}></div>
      </header>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product: any) => (
            <div key={product._id} className={styles.card}>
              <Link href={`/product/${product.slug}`} className={styles.imageWrapper}>
                <img 
                  src={product.imageUrl || '/placeholder.jpg'} 
                  alt={product.name} 
                  className={styles.image} 
                />
              </Link>
              <div className={styles.info}>
                <h3 className={styles.productName}>{product.name}</h3>
                
                {/* 3. Εμφάνιση τιμής ΧΩΡΙΣ το σύμβολο € */}
                <p className={styles.price}>
                   {product.price ? product.price.toFixed(2).replace('.', ',') : '---'}
                </p>
                
                <Link href={`/product/${product.slug}`} className={styles.moreBtn}>
                  ΠΕΡΙΣΣΟΤΕΡΑ
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>Δεν βρέθηκαν προϊόντα για το θέμα: <strong>{getThemeTitle(slug)}</strong></p>
          <Link href="/" className={styles.backLink}>Επιστροφή στην Αρχική</Link>
        </div>
      )}
    </main>
  );
}

// Helper function για το fallback τίτλο στο error state
const getThemeTitle = (slug: string) => {
    const titles: { [key: string]: string } = {
      christos: 'Χριστός',
      panagia: 'Παναγία',
      agioi: 'Άγιοι',
      parastaseis: 'Παραστάσεις'
    };
    return titles[slug] || slug;
};