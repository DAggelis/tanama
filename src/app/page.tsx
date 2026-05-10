import Hero from "@/components/Hero/Hero";
import Features from "@/components/Features/Features";
import BestSellers from "@/components/BestSellers/BestSellers";
import AboutStudio from "@/components/AboutStudio/AboutStudio";
import ThemeGrid from "@/components/ThemeGrid/ThemeGrid";
import Newsletter from "@/components/Newsletter/Newsletter";
import FAQ from "@/components/FAQ/FAQ";
import PromoBanner from "@/components/PromoBanner"; // <--- Προσθήκη

export default function Home() {
  return (
    <main>
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Promo Banner - Ανάμεσα στο Hero και το περιεχόμενο */}
      <PromoBanner />

      {/* 3. Main Content Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Features />
        <BestSellers />
        <AboutStudio />
        
        <section style={{ padding: '60px 0' }}>
          <h2 style={{ 
            textAlign: 'center', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            color: '#294038',
            marginBottom: '40px' 
          }}>
             Αναζήτηση ανά Θέμα
          </h2>
          <ThemeGrid />
        </section>
      </div>

      {/* 4. Full Width Sections */}
      <Newsletter />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <FAQ />
      </div>
    </main>
  );
}
