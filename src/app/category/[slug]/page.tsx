import { client } from '@/sanity/lib/client';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryData(slug: string) {
  try {
    // 1. Βρίσκουμε την τρέχουσα κατηγορία βάσει του slug
    const categoryInfo = await client.fetch(`
      *[_type == "category" && slug.current == $slug][0] { 
        _id, 
        title 
      }
    `, { slug });

    if (!categoryInfo) return null;

    // 2. Βρίσκουμε ΟΛΑ τα IDs των υποκατηγοριών σε οποιοδήποτε βάθος.
    // Η references($targetId) βρίσκει όσες κατηγορίες έχουν ως parent αυτήν,
    // και το "|| parent->parent._ref" κλπ καλύπτει τα βαθύτερα επίπεδα.
    const allRelatedIds = await client.fetch(`
      *[_type == "category" && (
        _id == $targetId || 
        parent._ref == $targetId || 
        parent->parent._ref == $targetId || 
        parent->parent->parent._ref == $targetId
      )]._id
    `, { targetId: categoryInfo._id });

    // 3. Φέρνουμε τα προϊόντα που ανήκουν σε οποιοδήποτε από αυτά τα IDs.
    // Ελέγχουμε τόσο το πεδίο 'category' (μονό) όσο και το 'categories' (πίνακας).
    const products = await client.fetch(`
      *[_type == "product" && (
        category._ref in $ids || 
        count((categories[]._ref)[@ in $ids]) > 0
      )] {
        _id,
        "title": name,
        "slug": slug.current,
        "price": price,
        "sku": sku,
        "shortDesc": shortDescription, 
        "imageUrl": mainImage.asset->url,
        "variants": variants[] {
          "variantTitle": variantTitle,
          "variantPrice": variantPrice,
          "variantSku": variantSku,
          "variantWeight": variantWeight,
          "dimensions": variantDimensions
        }
      }
    `, { ids: allRelatedIds });

    return { 
      title: categoryInfo.title, 
      products: Array.isArray(products) ? products : [] 
    };
  } catch (error) {
    console.error("Sanity Error:", error);
    return null;
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Η ΚΑΤΗΓΟΡΙΑ ΔΕΝ ΒΡΕΘΗΚΕ</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{data.title.toUpperCase()}</h1>
        <div className={styles.underline}></div>
        <p className={styles.count}>{data.products.length} ΠΡΟΪΟΝΤΑ</p>
      </header>
      
      <div className={styles.productGrid}>
        {data.products.length > 0 ? (
          data.products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία.</p>
          </div>
        )}
      </div>
    </div>
  );
}