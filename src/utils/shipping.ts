export const getShippingCost = (totalWeight: number, totalAmount: number, countryCode: string) => {
  // 1. ΕΣΩΤΕΡΙΚΟ (ΕΛΛΑΔΑ) - Β' Προτεραιότητα
  if (countryCode === 'GR') {
    if (totalAmount >= 100) return 0; // Δωρεάν μόνο για Ελλάδα > 100€
    if (totalWeight <= 200) return 3.20;
    if (totalWeight <= 1000) return 5.00;
    if (totalWeight <= 2000) return 8.00;
    // Για πάνω από 2 κιλά Ελλάδα (Δέμα εσωτερικού ενδεικτικά)
    return 10.00;
  }

  // 2. ΕΞΩΤΕΡΙΚΟ - Β' ΠΡΟΤΕΡΑΙΟΤΗΤΑ (ΣΥΣΤΗΜΕΝΟ)
  // Προσθέτουμε 150γρ για τη συσκευασία (κουτί/αεροπλάστ)
  const weight = totalWeight + 150;

  // Ορισμός Χωρών ανά Ζώνη (Ενδεικτικά - συμπλήρωσε κατά βούληση)
  const zone1 = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
  const zone2 = ['US', 'CA', 'CH', 'IS', 'NO', 'TR'];
  const zone3 = ['AU', 'NZ', 'JP', 'BR', 'ZA']; // Αυστραλία, Ζηλανδία κλπ.

  // --- Α. ΕΠΙΣΤΟΛΙΚΟ (Έως 2000γρ) ---
  if (weight <= 2000) {
    if (zone1.includes(countryCode)) { // ΖΩΝΗ 1
      if (weight <= 100) return 10.50;
      if (weight <= 250) return 12.50;
      if (weight <= 500) return 16.50;
      if (weight <= 1000) return 24.50;
      return 35.00;
    } 
    if (zone2.includes(countryCode)) { // ΖΩΝΗ 2
      if (weight <= 100) return 11.50;
      if (weight <= 250) return 14.50;
      if (weight <= 500) return 19.50;
      if (weight <= 1000) return 29.50;
      return 42.00;
    }
    // ΖΩΝΗ 3 (Υπόλοιπος Κόσμος - π.χ. Αυστραλία)
    if (weight <= 100) return 12.50;
    if (weight <= 250) return 16.50;
    if (weight <= 500) return 21.50;
    if (weight <= 1000) return 33.00; // Η περίπτωση της εικόνας 400γρ
    return 49.50;
  }

  // --- Β. ΔΕΜΑΤΑ (Πάνω από 2000γρ) ---
  // Υπολογισμός βάσει PDF: Κυρίως Τέλος (Πάγιο) + Τέλος ανά κιλό
  const weightInKg = Math.ceil(weight / 1000);

  if (zone1.includes(countryCode)) {
      return 18.00 + (weightInKg * 4.00); // Παράδειγμα Ζώνης 1
  }
  if (zone2.includes(countryCode)) {
      return 25.00 + (weightInKg * 5.50); // Παράδειγμα Ζώνης 2
  }
  // ΖΩΝΗ 3 (Αυστραλία κλπ)
  return 32.00 + (weightInKg * 6.50); 
};