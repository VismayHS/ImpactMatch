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
 * Filter causes that match user's selected cities ONLY
 * Simplified to city-based filtering only (no interest matching)
 */
function filterCausesByPreferences(causes, selectedInterests = [], selectedCities = []) {
  if (!causes || causes.length === 0) {
    console.log('⚠️ FILTER: No causes to filter');
    return [];
  }

  // If no cities selected, return all causes
  if (selectedCities.length === 0) {
    console.log('⚠️⚠️⚠️ WARNING: NO CITIES SELECTED!');
    console.log('  User has not selected any cities in preferences');
    console.log('  Returning all', causes.length, 'causes (unfiltered)');
    return causes;
  }

  console.log('🔍 CITY FILTER INPUT:', {
    totalCauses: causes.length,
    selectedCities: selectedCities
  });

  // Log sample of what we're filtering
  console.log('📦 Sample causes in database:', causes.slice(0, 3).map(c => ({
    name: c.name,
    city: c.city
  })));

  const filtered = causes.filter(cause => {
    // IMPORTANT: Normalize strings for comparison (case-insensitive, trim spaces)
    const causeCity = (cause.city || '').trim().toLowerCase();
    const normalizedCities = selectedCities.map(c => c.trim().toLowerCase());
    
    // Cause MUST match one of the selected cities
    const passes = normalizedCities.includes(causeCity);
    
    if (passes) {
      console.log(`  ✅ PASSED: "${cause.name}" in ${cause.city}`);
    } else {
      console.log(`  ❌ FILTERED OUT: "${cause.name}" in ${cause.city} (not in selected cities)`);
    }
    
    return passes;
  });

  console.log('✅ FILTER OUTPUT:', filtered.length, 'causes passed filter');
  
  // VERIFICATION: Log what cities are in the filtered results
  const resultCities = [...new Set(filtered.map(c => c.city))];
  console.log('📊 FILTERED RESULTS SUMMARY:');
  console.log('  Cities in results:', resultCities);
  console.log('  Expected cities:', selectedCities);
  console.log('  ✅ Match:', JSON.stringify(resultCities.sort()) === JSON.stringify([...selectedCities].sort()));
  
  return filtered;
}

/**
 * Get personalized causes for user based on CITY preferences only
 * Combines city filtering and TF-IDF ranking
 */
function getPersonalizedCauses(causes, userPreferences) {
  const { selectedCities = [] } = userPreferences;

  console.log('🎯 GET PERSONALIZED CAUSES:');
  console.log('  Total causes:', causes.length);
  console.log('  Selected cities:', selectedCities);

  // Step 1: Filter causes that match selected cities
  const filteredCauses = filterCausesByPreferences(causes, [], selectedCities);

  // Step 2: Rank filtered causes using TF-IDF
  const rankedCauses = rankCausesByPreferences(filteredCauses, [], selectedCities);

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
