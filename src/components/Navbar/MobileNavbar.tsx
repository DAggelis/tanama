"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, ShoppingBag, Trash2, Plus, Minus, Search, Loader2 } from 'lucide-react';
import styles from './MobileNavbar.module.css';
import { client } from '@/sanity/lib/client';
import logoImg from '../../../public/logo.png';
import { useCart } from '@/context/CartContext';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  subcategories?: Category[];
}

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  
  // AJAX Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ΔΙΟΡΘΩΣΗ: Παίρνουμε το subtotal αντί για το totalPrice
  const { cart, subtotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  // AJAX Logic για τα Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      const term = searchQuery.toLowerCase();
      const query = `*[_type == "product" && (name match $term || sku match $term || slug.current match $term)][0...4] {
        _id, name, "slug": slug.current, "imageUrl": mainImage.asset->url, price
      }`;
      try {
        const data = await client.fetch(query, { term: `*${term}*` });
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Logic για το αυτόματο άνοιγμα καλαθιού
  useEffect(() => {
    const handleOpen = () => { if (window.innerWidth <= 1024) setIsCartOpen(true); };
    window.addEventListener('openCartGlobal', handleOpen);
    return () => window.removeEventListener('openCartGlobal', handleOpen);
  }, []);

  useEffect(() => {
    const query = `*[_type == "category" && !defined(parent)] | order(order asc) {
      _id, title, slug,
      "subcategories": *[_type == "category" && references(^._id)] | order(order asc) {
        _id, title, slug,
        "subcategories": *[_type == "category" && references(^._id)] | order(order asc) { _id, title, slug }
      }
    }`;
    client.fetch(query).then(setCategories);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeAll();
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedCats(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const closeAll = () => { 
    setIsMenuOpen(false); 
    setIsCartOpen(false); 
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <nav className={styles.mobileWrapper}>
      {/* HEADER */}
      <div className={styles.mobileHeader}>
        <button className={styles.iconBtn} onClick={() => { setIsMenuOpen(true); setIsSearchOpen(false); }}>
          <Menu size={24} />
        </button>
        
        <Link href="/" className={styles.logoLink} onClick={closeAll}>
            <Image src={logoImg} alt="Logo" width={100} height={40} style={{ objectFit: 'contain' }} priority />
        </Link>

        <div className={styles.rightIcons}>
          <button className={styles.iconBtn} onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); }}>
            {isSearchOpen ? <X size={22} /> : <Search size={22} />}
          </button>
          <button className={styles.iconBtn} onClick={() => { setIsCartOpen(true); setIsSearchOpen(false); }}>
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className={styles.badge}>
                {cart.reduce((acc: number, item: any) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SEARCH ROW */}
      <div className={`${styles.searchRow} ${isSearchOpen ? styles.searchActive : ''}`}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input 
            type="text" 
            placeholder="Αναζητήστε προϊόντα..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            autoFocus={isSearchOpen}
          />
          <button type="submit" className={styles.searchBtn}>
            {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <Search size={18} />}
          </button>
        </form>

        {searchQuery.length >= 2 && (
          <div className={styles.mobileSuggestions}>
            {suggestions.length > 0 ? (
              <>
                {suggestions.map((item) => (
                  <Link key={item._id} href={`/product/${item.slug || ''}`} className={styles.mobSuggestItem} onClick={closeAll}>
                    <img src={item.imageUrl || '/placeholder.jpg'} alt={item.name} className={styles.mobSuggestThumb} />
                    <div className={styles.mobSuggestInfo}>
                      <span className={styles.mobSuggestName}>{item.name}</span>
                      <span className={styles.mobSuggestPrice}>
                        {item.price ? `${Number(item.price).toFixed(2).replace('.', ',')} €` : "--- €"}
                      </span>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              !isLoading && <div className={styles.noSuggest}>Κανένα αποτέλεσμα</div>
            )}
          </div>
        )}
      </div>

      {/* LEFT MENU PANEL */}
      <div className={`${styles.sidePanel} ${styles.left} ${isMenuOpen ? styles.active : ''}`}>
        <div className={styles.panelHeader}>
          <button className={styles.closeBtn} onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
        </div>
        <div className={styles.panelContent}>
          <Link href="/" className={styles.menuBrandingLink} onClick={closeAll}>
            <Image src={logoImg} alt="Logo" width={80} height={80} className={styles.menuLogo} />
            <span className={styles.menuTagline}>ΠΑΡΑΔΟΣΙΑΚΑ ΧΕΙΡΟΠΟΙΗΜΑΤΑ</span>
          </Link>
          <div className={styles.navLinks}>
            {categories.map((cat) => (
              <div key={cat._id} className={styles.categoryBlock}>
                <div className={styles.row}>
                  <Link href={`/category/${cat.slug.current}`} className={styles.categoryLink} onClick={closeAll}>
                    {cat.title.toUpperCase()}
                  </Link>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <button className={styles.toggleBtn} onClick={(e) => toggleExpand(cat._id, e)}>
                      {expandedCats.includes(cat._id) ? '−' : '+'}
                    </button>
                  )}
                </div>
                {expandedCats.includes(cat._id) && cat.subcategories && (
                  <div className={styles.submenu}>
                    {cat.subcategories.map(sub => (
                      <div key={sub._id} className={styles.subCategoryBlock}>
                        <Link href={`/category/${sub.slug.current}`} onClick={closeAll} className={styles.subLink}>{sub.title}</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT CART PANEL */}
      <div className={`${styles.sidePanel} ${styles.right} ${isCartOpen ? styles.active : ''}`}>
        <div className={styles.panelHeader}>
          <span className={styles.cartTitle}>ΤΟ ΚΑΛΑΘΙ ΜΟΥ</span>
          <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}><X size={24} /></button>
        </div>
        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div className={styles.emptyCartWrapper}>
              <ShoppingBag size={50} color="#ccc" />
              <p>Το καλάθι σας είναι άδειο</p>
            </div>
          ) : (
            <div className={styles.cartScrollList}>
              {cart.map((item: any, index: number) => (
                <div key={`${item._id}-${index}`} className={styles.cartItem}>
                  <img src={item.imageUrl || '/placeholder.jpg'} alt={item.title} className={styles.cartThumb} />
                  <div className={styles.cartItemInfo}>
                    <span className={styles.cartItemTitle}>{item.title}</span>
                    <div className={styles.cartItemControls}>
                      <div className={styles.qtyBox}>
                        <button onClick={() => updateQuantity(item._id, item.title, -1)}><Minus size={12}/></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.title, 1)}><Plus size={12}/></button>
                      </div>
                      <span className={styles.priceText}>
                        {(Number(item.price || 0) * item.quantity).toFixed(2).replace('.', ',')}€
                      </span>
                      <button onClick={() => removeFromCart(item._id, item.title)} className={styles.deleteBtn}><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.totalRow}>
              <span>ΣΥΝΟΛΟ:</span>
              {/* ΔΙΟΡΘΩΣΗ: Χρήση subtotal */}
              <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
            </div>
            <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginBottom: '10px' }}>
              * Τα μεταφορικά υπολογίζονται στο checkout
            </p>
            <Link href="/checkout" className={styles.checkoutBtn} onClick={closeAll}>ΟΛΟΚΛΗΡΩΣΗ ΑΓΟΡΑΣ</Link>
          </div>
        )}
      </div>

      {(isMenuOpen || isCartOpen || isSearchOpen) && <div className={styles.overlay} onClick={closeAll} />}
    </nav>
  );
}