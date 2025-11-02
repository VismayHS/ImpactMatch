/**
 * TF-IDF Based Cause Matching for Personalized Recommendations
 * 
 * This module implements TF-IDF (Term Frequency-Inverse Document Frequency) 
 * algorithm to rank causes based on user preferences (interests and cities).
 */

/**
 * Calculate Term Frequency (TF)
 * TF(t, d) = (Number of times term t appears in document d) / (Total terms in document d)
 */
function calculateTF(term, document) {
  const terms = document.toLowerCase().split(/\s+/);
  const termCount = terms.filter(t => t === term.toLowerCase()).length;
  return termCount / terms.length;
}

/**
 * Calculate Inverse Document Frequency (IDF)
 * IDF(t, D) = log(Total number of documents / Number of documents containing term t)
 */
function calculateIDF(term, documents) {
  const docsWithTerm = documents.filter(doc => 
    doc.toLowerCase().includes(term.toLowerCase())
  ).length;
  
  if (docsWithTerm === 0) return 0;
  return Math.log(documents.length / docsWithTerm);
}

/**
 * Calculate TF-IDF score for a term in a document
 * TF-IDF(t, d, D) = TF(t, d) × IDF(t, D)
 */
function calculateTFIDF(term, document, allDocuments) {
  const tf = calculateTF(term, document);
  const idf = calculateIDF(term, allDocuments);
  return tf * idf;
}

/**
 * Rank causes based on user's selected interests and cities using TF-IDF
 * 
 * @param {Array} causes - Array of cause objects from database
 * @param {Array} selectedInterests - User's selected interest categories
 * @param {Array} selectedCities - User's selected cities
 * @returns {Array} - Sorted array of causes with relevance scores
 */
/**
 * Just return causes as-is (no ranking, no sorting)
 * Filtering already happened, so just pass them through
 */
function rankCausesByPreferences(causes, selectedInterests = [], selectedCities = []) {
  if (!causes || causes.length === 0) {
    return [];
  }

  console.log('📋 Returning causes (no ranking applied):', causes.length);

  // Just add a relevanceScore of 0 to all causes and return as-is
  return causes.map(cause => ({
    ...cause,
    relevanceScore: 0
  }));
}

/**
 * Filter causes that match user's selected categories AND cities
 * Causes must match BOTH category and city preferences
 */
function filterCausesByPreferences(causes, selectedCategories = [], selectedCities = []) {
  if (!causes || causes.length === 0) {
    console.log('⚠️ FILTER: No causes to filter');
    return [];
  }

  // If no preferences selected at all, return all causes
  if (selectedCategories.length === 0 && selectedCities.length === 0) {
    console.log('⚠️⚠️⚠️ WARNING: NO PREFERENCES SELECTED!');
    console.log('  User has not selected any categories or cities in preferences');
    console.log('  Returning all', causes.length, 'causes (unfiltered)');
    return causes;
  }

  console.log('🔍 CATEGORY + CITY FILTER INPUT:', {
    totalCauses: causes.length,
    selectedCategories: selectedCategories,
    selectedCities: selectedCities
  });

  // Log sample of what we're filtering
  console.log('📦 Sample causes in database:', causes.slice(0, 3).map(c => ({
    name: c.name,
    category: c.category,
    city: c.city
  })));

  const filtered = causes.filter(cause => {
    // IMPORTANT: Normalize strings for comparison (case-insensitive, trim spaces)
    const causeCity = (cause.city || '').trim().toLowerCase();
    const causeCategory = (cause.category || '').trim().toLowerCase();
    const normalizedCities = selectedCities.map(c => c.trim().toLowerCase());
    const normalizedCategories = selectedCategories.map(c => c.trim().toLowerCase());
    
    // Check if cause matches city (if cities are selected)
    const cityMatch = selectedCities.length === 0 || normalizedCities.includes(causeCity);
    
    // Check if cause matches category (if categories are selected)
    const categoryMatch = selectedCategories.length === 0 || normalizedCategories.includes(causeCategory);
    
    // Cause must match BOTH filters (or filter must be empty)
    const passes = cityMatch && categoryMatch;
    
    if (passes) {
      console.log(`  ✅ PASSED: "${cause.name}" [${cause.category}] in ${cause.city}`);
    } else {
      const reason = !cityMatch ? 'city mismatch' : 'category mismatch';
      console.log(`  ❌ FILTERED OUT: "${cause.name}" [${cause.category}] in ${cause.city} (${reason})`);
    }
    
    return passes;
  });

  console.log('✅ FILTER OUTPUT:', filtered.length, 'causes passed filter');
  
  // VERIFICATION: Log what categories and cities are in the filtered results
  const resultCities = [...new Set(filtered.map(c => c.city))];
  const resultCategories = [...new Set(filtered.map(c => c.category))];
  console.log('📊 FILTERED RESULTS SUMMARY:');
  console.log('  Categories in results:', resultCategories);
  console.log('  Cities in results:', resultCities);
  console.log('  Expected categories:', selectedCategories);
  console.log('  Expected cities:', selectedCities);
  
  return filtered;
}

/**
 * Get personalized causes for user based on CATEGORY and CITY preferences
 * Combines category+city filtering and TF-IDF ranking
 */
function getPersonalizedCauses(causes, userPreferences) {
  const { selectedCategories = [], selectedCities = [] } = userPreferences;

  console.log('🎯 GET PERSONALIZED CAUSES:');
  console.log('  Total causes:', causes.length);
  console.log('  Selected categories:', selectedCategories);
  console.log('  Selected cities:', selectedCities);

  // Step 1: Filter causes that match selected categories AND cities
  const filteredCauses = filterCausesByPreferences(causes, selectedCategories, selectedCities);

  // Step 2: Rank filtered causes using TF-IDF
  const rankedCauses = rankCausesByPreferences(filteredCauses, selectedCategories, selectedCities);

  console.log('  Final personalized causes:', rankedCauses.length);

  return rankedCauses;
}

module.exports = {
  calculateTF,
  calculateIDF,
  calculateTFIDF,
  rankCausesByPreferences,
  filterCausesByPreferences,
  getPersonalizedCauses
};
