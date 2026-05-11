"use client";
import { useState, useEffect, useRef } from 'react';
import { User, ShoppingCart, Search, X, ShoppingBag, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext'; 
import { client } from '@/sanity/lib/client'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // AJAX Search States
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // ΑΛΛΑΓΗ ΕΔΩ: Παίρνουμε το subtotal αντί για το totalPrice
  const { cart, subtotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Κλείσιμο suggestions με κλικ έξω
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // AJAX Logic για τα Live Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      const term = searchQuery.toLowerCase();
      
      const query = `*[_type == "product" && (name match $term || sku match $term || slug.current match $term)][0...5] {
        _id,
        name,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        price
      }`;

      try {
        const data = await client.fetch(query, { term: `*${term}*` });
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestions error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleOpen = () => {
      if (window.innerWidth > 1024) setIsCartOpen(true);
    };
    window.addEventListener('openCartGlobal', handleOpen);
    return () => window.removeEventListener('openCartGlobal', handleOpen);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <span className={styles.brandText}>ΒΥΖΑΝΤΙΝΕΣ ΑΓΙΟΓΡΑΦΙΕΣ — ΜΟΝΑΣΤΗΡΙΑΚΑ ΠΡΟΪΟΝΤΑ</span>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.toolsGroup}>
            <button className={styles.iconBtn} aria-label="Λογαριασμός Χρήστη"><User size={22} /></button>
            <button 
              className={styles.iconBtn} 
              onClick={() => { if (window.innerWidth > 1024) setIsCartOpen(true); }}
            >
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className={styles.cartBadge}>
                  {cart.reduce((acc: number, item: any) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
            
            <div className={styles.searchContainer} ref={searchRef}>
              <form className={styles.searchWrapper} onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Αναζήτηση..." 
                  className={styles.searchInput} 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                />
                <button type="submit" className={styles.searchButton}>
                  {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <Search size={18} color="white" />}
                </button>
              </form>

              {showSuggestions && searchQuery.length >= 2 && (
                <div className={styles.suggestionsDropdown}>
                  {suggestions.length > 0 ? (
                    <>
                      {suggestions.map((item) => (
                        <Link 
                          key={item._id} 
                          href={`/product/${item.slug || ''}`}
                          className={styles.suggestionItem}
                          onClick={() => setShowSuggestions(false)}
                        >
                          <img 
                            src={item.imageUrl || '/placeholder.jpg'} 
                            alt={item.name} 
                            className={styles.suggestThumb} 
                          />
                          <div className={styles.suggestInfo}>
                            <span className={styles.suggestName}>{item.name}</span>
                            <span className={styles.suggestPrice}>
                              {item.price 
                                ? `${Number(item.price).toFixed(2).replace('.', ',')} €` 
                                : "--- €"}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <button className={styles.viewAllBtn} onClick={handleSearch}>
                        Όλα τα αποτελέσματα για "{searchQuery}"
                      </button>
                    </>
                  ) : (
                    !isLoading && <div className={styles.noSuggest}>Κανένα αποτέλεσμα</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={`${styles.cartDrawer} ${isCartOpen ? styles.cartActive : ''}`}>
        <div className={styles.cartHeader}>
          <h3>ΤΟ ΚΑΛΑΘΙ ΜΟΥ</h3>
          <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}><X size={24} /></button>
        </div>
        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={50} strokeWidth={1} color="#ccc" />
              <p>Το καλάθι σας είναι άδειο</p>
            </div>
          ) : (
            <div className={styles.cartItemsList}>
              {cart.map((item: any, index: number) => (
                <div key={`${item._id}-${index}`} className={styles.cartItem}>
                  <img src={item.imageUrl || '/placeholder.jpg'} alt={item.title} className={styles.cartThumb} />
                  <div className={styles.cartInfo}>
                    <h4>{item.title}</h4>
                    <div className={styles.qtyRow}>
                      <div className={styles.quantityControls}>
                        <button onClick={() => updateQuantity(item._id, item.title, -1)} className={styles.qtyBtn}><Minus size={14} /></button>
                        <span className={styles.qtyNumber}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.title, 1)} className={styles.qtyBtn}><Plus size={14} /></button>
                      </div>
                      <span className={styles.itemPrice}>
                        {(Number(item.price || 0) * item.quantity).toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id, item.title)} className={styles.removeBtn}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.totalRow}>
              <span>ΣΥΝΟΛΟ:</span>
              {/* ΑΛΛΑΓΗ ΕΔΩ: Χρήση subtotal αντί για totalPrice */}
              <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
            </div>
            <p className={styles.shippingNotice} style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
              * Τα μεταφορικά υπολογίζονται στο ταμείο
            </p>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <button className={styles.checkoutBtn}>ΟΛΟΚΛΗΡΩΣΗ ΑΓΟΡΑΣ</button>
            </Link>
          </div>
        )}
      </div>
      {isCartOpen && <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />}
    </>
  );
}