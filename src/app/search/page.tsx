"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './SearchPage.module.css';

// Interface για το TypeScript
interface Product {
  _id: string;
  name: string;
  sku?: string;
  price: number;
  slug: string; 
  imageUrl: string;
  shortDesc?: string;
  variants?: any[];
}

// Συνάρτηση για αφαίρεση τόνων (Normalization)
const normalize = (str: string) => 
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function SearchContent() {
  const searchParams = useSearchParams();
  // Παίρνουμε την αρχική τιμή από το URL
  const initialQuery = searchParams.get('q') || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [localTerm, setLocalTerm] = useState(initialQuery);

  useEffect(() => {
    const fetchResults = async () => {
      const termToSearch = localTerm.trim();
      
      // Ξεκινάμε την αναζήτηση αν έχουμε τουλάχιστον 2 χαρακτήρες
      if (termToSearch.length < 2) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const lowerTerm = termToSearch.toLowerCase();
      const noAccents = normalize(termToSearch);

      // Το Query που ψάχνει παντού: Όνομα, SKU, Slug (Greeklish), Keywords, Περιγραφή
      const groqQuery = `*[_type == "product" && (
        name match $searchTerm || 
        name match $noAccents ||
        sku match $searchTerm ||
        slug.current match $searchTerm ||
        searchKeywords match $searchTerm || 
        searchKeywords match $noAccents ||
        shortDescription match $searchTerm ||
        categories[]->title match $searchTerm
      )] {
        _id,
        name,
        sku,
        price,
        "slug": slug.current, 
        "imageUrl": mainImage.asset->url,
        "shortDesc": shortDescription,
        variants
      }`;

      try {
        const data = await client.fetch(groqQuery, { 
          searchTerm: `*${lowerTerm}*`, 
          noAccents: `*${noAccents}*` 
        });
        setProducts(data);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce για να μην "κουράζουμε" το API καθώς πληκτρολογεί ο χρήστης
    const timeoutId = setTimeout(fetchResults, 400);
    return () => clearTimeout(timeoutId);

    // Χρησιμοποιούμε μόνο το localTerm ως dependency για να αποφύγουμε το Error Render Size
  }, [localTerm]); 

  return (
    <div className={styles.container}>
      <div className={styles.searchHeader}>
        <h1 className={styles.title}>Αναζήτηση Προϊόντων</h1>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            className={styles.ajaxInput}
            placeholder="Αναζήτηση με όνομα, κωδικό, greeklish..."
            value={localTerm}
            onChange={(e) => setLocalTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {loading && (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          Αναζήτηση σε εξέλιξη...
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard 
              key={p._id} 
              product={{
                ...p, 
                title: p.name // Περνάμε το name ως title για συμβατότητα με το ProductCard
              }} 
            />
          ))}
        </div>
      )}

      {!loading && localTerm.length >= 2 && products.length === 0 && (
        <div className={styles.noResults}>
          <p>Δεν βρέθηκαν αποτελέσματα για <strong>"{localTerm}"</strong>.</p>
          <span>Δοκιμάστε να γράψετε με διαφορετικό τρόπο ή ελέγξτε την ορθογραφία.</span>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Φόρτωση αναζήτησης...</div>}>
      <SearchContent />
    </Suspense>
  );
}