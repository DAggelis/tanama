"use client";

import { useState } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import styles from './QuickView.module.css';
import { useCart } from '@/context/CartContext';

export default function QuickView({ product, onClose }: { product: any; onClose: () => void }) {
  const { addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const selectedVariant = selectedVariantIndex !== null ? variants[selectedVariantIndex] : null;

  const renderPriceDisplay = () => {
    if (selectedVariant) {
      const p = Number(selectedVariant.variantPrice || 0);
      return p > 0 ? `${p.toFixed(2).replace('.', ',')} €` : "Κατόπιν Παραγγελίας";
    }

    const basePrice = Number(product?.price || 0);
    const allPrices = [
      basePrice, 
      ...variants.map((v: any) => Number(v.variantPrice || 0))
    ].filter((p: number) => p > 0);

    if (allPrices.length === 0) return "Κατόπιν Παραγγελίας";

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    return minPrice === maxPrice 
      ? `${minPrice.toFixed(2).replace('.', ',')} €` 
      : `${minPrice.toFixed(2).replace('.', ',')} € - ${maxPrice.toFixed(2).replace('.', ',')} €`;
  };

  const handleAddToCart = () => {
    // 1. Σωστή τιμή (Number)
    const finalPrice = selectedVariant 
      ? Number(selectedVariant.variantPrice) 
      : Number(product?.price || 0);
    
    // 2. Σωστός τίτλος με την παραλλαγή
    const finalTitle = selectedVariant 
      ? `${product?.title} (${selectedVariant.variantTitle})` 
      : product?.title;

    // 3. Σωστό βάρος (για να δουλέψουν οι κανόνες μεταφορικών στο Context/API)
    const finalWeight = selectedVariant?.variantWeight || product?.weight || 0;

    addToCart({
      _id: product?._id,
      title: finalTitle,
      price: finalPrice,
      imageUrl: product?.imageUrl,
      quantity: quantity,
      weight: finalWeight // Προσθήκη βάρους
    });

    // Ενημέρωση του UI για το άνοιγμα του καλαθιού
    window.dispatchEvent(new Event('openCartGlobal'));
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        
        <div className={styles.grid}>
          <div className={styles.imageSide}>
            <img 
              src={product?.imageUrl || '/placeholder.jpg'} 
              alt={product?.title} 
              className={styles.mainImg} 
            />
          </div>

          <div className={styles.infoSide}>
            <header>
              <h2 className={styles.title}>{product?.title}</h2>
              <div className={styles.price}>{renderPriceDisplay()}</div>
            </header>
            
            {product?.shortDesc && <p className={styles.description}>{product.shortDesc}</p>}

            {variants.length > 0 && (
              <div className={styles.variantsSection}>
                <label className={styles.label}>ΕΠΙΛΟΓΗ ΜΕΓΕΘΟΥΣ</label>
                <select 
                  className={styles.selectInput}
                  value={selectedVariantIndex ?? ""}
                  onChange={(e) => setSelectedVariantIndex(parseInt(e.target.value))}
                >
                  <option value="" disabled>Επιλέξτε μέγεθος...</option>
                  {variants.map((v: any, i: number) => (
                    <option key={i} value={i}>
                      {v.variantTitle} — {Number(v.variantPrice || 0).toFixed(2).replace('.', ',')} €
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.cartActions}>
              <div className={styles.quantityWrapper}>
                <button 
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
                  className={styles.qtyBtn}
                >
                  <Minus size={16}/>
                </button>
                
                <span className={styles.qtyValue}>{quantity}</span>
                
                <button 
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)} 
                  className={styles.qtyBtn}
                >
                  <Plus size={16}/>
                </button>
              </div>
              
              <button 
                className={styles.addToCartBtn}
                disabled={variants.length > 0 && selectedVariantIndex === null}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} /> ΠΡΟΣΘΗΚΗ {quantity > 1 && `(${quantity})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}