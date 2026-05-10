"use client";

import { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import styles from './ProductPage.module.css';
import { useCart } from '@/context/CartContext'; 

const ptComponents = {
  block: {
    h1: ({children}: any) => <h1 className={styles.descH1}>{children}</h1>,
    h2: ({children}: any) => <h2 className={styles.descH2}>{children}</h2>,
    h3: ({children}: any) => <h3 className={styles.descH3}>{children}</h3>,
    normal: ({children}: any) => <p className={styles.descText}>{children}</p>,
  },
};

export default function ProductPage({ initialProduct }: { initialProduct: any }) {
  const product = initialProduct;
  const { addToCart } = useCart(); 
  
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    if (product?.imageUrl) {
      setActiveImg(product.imageUrl);
    }
  }, [product]);

  const selectedVariant = selectedVariantIndex !== null ? product.variants[selectedVariantIndex] : null;

  const renderPriceDisplay = () => {
    if (selectedVariant) {
      return `${selectedVariant.variantPrice.toFixed(2).replace('.', ',')} €`;
    }

    const basePrice = product?.price || 0;
    const variants = (product?.variants || []).filter((v: any) => v != null && v.variantPrice > 0);
    const allValidPrices = [basePrice, ...variants.map((v: any) => v.variantPrice)].filter(p => p > 0);

    if (allValidPrices.length === 0) return "Μη διαθέσιμο";

    const minPrice = Math.min(...allValidPrices);
    const maxPrice = Math.max(...allValidPrices);

    if (minPrice === maxPrice) {
      return `${minPrice.toFixed(2).replace('.', ',')} €`;
    }

    return `${minPrice.toFixed(2).replace('.', ',')} € - ${maxPrice.toFixed(2).replace('.', ',')} €`;
  };

  const currentPrice = selectedVariant ? selectedVariant.variantPrice : product.price;
  const currentSku = selectedVariant ? selectedVariant.variantSku : product.sku;

  const hasVariants = product.variants && product.variants.length > 0;
  const isAddToCartDisabled = hasVariants && selectedVariantIndex === null;

  // --- Η ΚΡΙΣΙΜΗ ΔΙΟΡΘΩΣΗ ΕΔΩ ---
  const handleAddToCart = () => {
    if (!product) return;
    const vName = selectedVariant?.variantTitle || "";
    
    addToCart({
      _id: product._id,
      title: vName ? `${product.title} (${vName})` : product.title,
      price: currentPrice,
      imageUrl: product.imageUrl,
      quantity: quantity,
      // Προσθήκη βάρους στο αντικείμενο του καλαθιού
      weight: product.weight, 
      variantWeight: selectedVariant?.variantWeight 
    });

    window.dispatchEvent(new Event('openCartGlobal'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <section className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            {activeImg ? (
              <img src={activeImg} alt={product?.title} className={styles.mainImage} />
            ) : (
              <div className={styles.loadingPlaceholder}>Φόρτωση...</div>
            )}
          </div>
          
          {product?.gallery && product.gallery.length > 0 && (
            <div className={styles.thumbnails}>
              {[product.imageUrl, ...product.gallery].filter(Boolean).map((imgUrl: string, index: number) => (
                <div 
                  key={index} 
                  className={`${styles.thumb} ${activeImg === imgUrl ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImg(imgUrl)}
                >
                  <img src={imgUrl} alt={`Προεπισκόπηση ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.infoSection}>
          <span className={styles.category}>{product?.category}</span>
          <h1 className={styles.productName}>{product?.title}</h1>
          <span className={styles.sku}>SKU: {currentSku}</span>
          
          <div className={styles.shortDesc}>{product?.shortDesc}</div>

          {hasVariants && (
            <div className={styles.variableGroup}>
              <label className={styles.label}>ΕΠΙΛΟΓΗ ΜΕΓΕΘΟΥΣ</label>
              <select 
                className={styles.selectInput}
                value={selectedVariantIndex !== null ? selectedVariantIndex : ""}
                onChange={(e) => setSelectedVariantIndex(parseInt(e.target.value))}
              >
                <option value="" disabled>Επιλέξτε μέγεθος...</option>
                {product.variants.map((v: any, index: number) => (
                  <option key={index} value={index}>
                    {v.variantTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.price}>
              {renderPriceDisplay()}
          </div>

          <div className={styles.cartActions}>
            <div className={styles.quantityWrapper}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}><Minus size={16}/></button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}><Plus size={16}/></button>
            </div>
            
            <button 
              className={styles.addToCartBtn} 
              disabled={isAddToCartDisabled}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} /> ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ
            </button>
          </div>
          
          <img src="/Safecheckout.webp" alt="Safe Checkout" className={styles.safeCheckout} />
        </section>
      </div>

      <section className={styles.tabsSection}>
        <div className={styles.tabHeaders}>
          <div 
            className={`${styles.tabTitle} ${activeTab === 'description' ? styles.activeTab : ''}`} 
            onClick={() => setActiveTab('description')}
          >
            ΠΕΡΙΓΡΑΦΗ
          </div>
          <div 
            className={`${styles.tabTitle} ${activeTab === 'specs' ? styles.activeTab : ''}`} 
            onClick={() => setActiveTab('specs')}
          >
            ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ
          </div>
        </div>
        <div className={styles.tabContent}>
          {activeTab === 'description' ? (
            <div className={styles.longDesc}>
              {product?.longDesc ? (
                <PortableText value={product.longDesc} components={ptComponents} />
              ) : (
                "Δεν υπάρχει διαθέσιμη περιγραφή."
              )}
            </div>
          ) : (
            <ul className={styles.specsList}>
              <li><strong>Βάρος:</strong> {selectedVariant?.variantWeight || product?.weight || "-"} gr</li>
              <li><strong>Διαστάσεις:</strong> {selectedVariant?.variantDimensions || product?.dimensions || "-"}</li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}