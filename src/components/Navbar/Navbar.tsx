"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { client } from '@/sanity/lib/client';
import logoImg from '../../../public/logo.png';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  subcategories?: Category[];
}

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  useEffect(() => {
    const query = `*[_type == "category" && !defined(parent)] | order(order asc) {
      _id,
      title,
      slug,
      "subcategories": *[_type == "category" && references(^._id)] | order(order asc) {
        _id,
        title,
        slug,
        "subcategories": *[_type == "category" && references(^._id)] | order(order asc) {
          _id,
          title,
          slug
        }
      }
    }`;
    client.fetch(query).then(setCategories);
  }, []);

  const toggleCat = (id: string) => setOpenCat(openCat === id ? null : id);
  const toggleSub = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    setOpenSub(openSub === id ? null : id);
  };

  return (
    <aside className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src={logoImg} alt="T'ÁNAMA" width={160} height={160} priority />
        </Link>
        <div className={styles.tagline}>ΠΑΡΑΔΟΣΙΑΚΑ ΧΕΙΡΟΠΟΙΗΜΑΤΑ</div>
      </div>

      <nav className={styles.menu}>
        {categories.map((cat) => (
          <div key={cat._id} className={styles.menuItem}>
            <div className={styles.menuHeader}>
              {/* Επαναφορά clickable Link */}
              <Link href={`/category/${cat.slug.current}`} className={styles.linkText}>
                {cat.title.toUpperCase()}
              </Link>
              
              {cat.subcategories && cat.subcategories.length > 0 && (
                <button className={styles.toggleBtn} onClick={() => toggleCat(cat._id)}>
                  {openCat === cat._id ? '−' : '+'}
                </button>
              )}
            </div>
            
            {openCat === cat._id && cat.subcategories && (
              <div className={styles.submenu}>
                {cat.subcategories.map((sub) => (
                  <div key={sub._id} className={styles.subItem}>
                    <div className={styles.subHeader}>
                        <Link href={`/category/${sub.slug.current}`} className={styles.subLink}>
                          {sub.title.toUpperCase()}
                        </Link>
                        {sub.subcategories && sub.subcategories.length > 0 && (
                          <button onClick={(e) => toggleSub(e, sub._id)} className={styles.arrowBtn}>
                            {openSub === sub._id ? '▾' : '▸'}
                          </button>
                        )}
                    </div>

                    {openSub === sub._id && sub.subcategories && (
                      <div className={styles.deepMenu}>
                        {sub.subcategories.map(deep => (
                          <Link key={deep._id} href={`/category/${deep.slug.current}`} className={styles.deepLink}>
                            {deep.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}