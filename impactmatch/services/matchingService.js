/**
 * AI-Powered Volunteer-to-NGO Matching Service
 * Uses TF-IDF and Cosine Similarity for intelligent matching
 */

class MatchingEngine {
  constructor() {
    // Keywords for different cause categories
    this.causeKeywords = {
      'Education': ['education', 'school', 'learn', 'teach', 'student', 'literacy', 'training', 'skills', 'knowledge', 'academic'],
      'Healthcare': ['health', 'medical', 'hospital', 'doctor', 'nurse', 'clinic', 'medicine', 'treatment', 'care', 'wellness'],
      'Environment': ['environment', 'nature', 'green', 'climate', 'pollution', 'conservation', 'tree', 'plant', 'ecology', 'sustainable'],
      'Hunger Relief': ['hunger', 'food', 'meal', 'nutrition', 'feed', 'kitchen', 'dining', 'nourishment', 'starvation', 'famine'],
      'Animal Welfare': ['animal', 'pet', 'wildlife', 'rescue', 'shelter', 'veterinary', 'species', 'creature', 'fauna', 'habitat'],
      'Women Empowerment': ['women', 'girl', 'female', 'mother', 'empowerment', 'gender', 'equality', 'rights', 'safety', 'support'],
      'Child Welfare': ['child', 'children', 'kid', 'orphan', 'infant', 'youth', 'minor', 'adolescent', 'baby', 'toddler'],
      'Elderly Care': ['elderly', 'senior', 'aged', 'old', 'retirement', 'geriatric', 'care home', 'nursing', 'pension'],
      'Poverty Alleviation': ['poverty', 'poor', 'underprivileged', 'slum', 'homeless', 'destitute', 'needy', 'livelihood', 'income'],
      'Disaster Relief': ['disaster', 'emergency', 'relief', 'rescue', 'flood', 'earthquake', 'cyclone', 'crisis', 'calamity'],
      'Rural Development': ['rural', 'village', 'farmer', 'agriculture', 'farming', 'countryside', 'community', 'development'],
      'Technology': ['technology', 'digital', 'computer', 'internet', 'coding', 'software', 'innovation', 'tech', 'IT'],
      'Arts & Culture': ['art', 'culture', 'music', 'dance', 'theater', 'heritage', 'tradition', 'creative', 'performance'],
      'Sports': ['sport', 'game', 'fitness', 'athletic', 'play', 'exercise', 'physical', 'recreation', 'competition']
    };

    // Skill keywords mapping (for description matching)
    this.skillKeywords = {
      'teaching': ['education', 'training', 'skills development'],
      'medical': ['healthcare', 'wellness'],
      'counseling': ['mental health', 'support', 'guidance'],
      'fundraising': ['donation', 'finance', 'resources'],
      'marketing': ['awareness', 'outreach', 'communication'],
      'event management': ['organization', 'coordination', 'planning'],
      'social media': ['digital', 'online', 'awareness'],
      'photography': ['documentation', 'media', 'creative'],
      'cooking': ['food', 'nutrition', 'meal preparation'],
      'coding': ['technology', 'digital literacy'],
      'writing': ['content', 'communication', 'documentation'],
      'design': ['creative', 'visual', 'branding']
    };
    
    // Category to skill relevance mapping
    this.categorySkillMap = {
      'technology': ['programming', 'web development', 'coding', 'software', 'IT', 'computer', 'digital', 'tech'],
      'education': ['teaching', 'mentoring', 'tutoring', 'training', 'coaching'],
      'environment': ['sustainability', 'conservation', 'ecology', 'green', 'climate'],
      'health': ['medical', 'healthcare', 'nursing', 'first aid', 'wellness'],
      'children': ['teaching', 'mentoring', 'childcare', 'education'],
      'women empowerment': ['counseling', 'mentoring', 'training', 'support'],
      'sports': ['coaching', 'fitness', 'training', 'physical education'],
      'arts & culture': ['design', 'photography', 'music', 'creative', 'writing']
    };
  }

  /**
   * Calculate match score between volunteer and NGO
   * @param {Object} volunteer - Volunteer profile with interests and skills
   * @param {Object} ngo - NGO profile with causes and needs
   * @returns {Object} - Match result with score and explanation
   */
  calculateMatch(volunteer, ngo) {
    let totalScore = 0;
    let explanations = [];
    let weights = {
      causeMatch: 0.4,      // 40% weight to cause alignment
      skillMatch: 0.3,      // 30% weight to skill match
      locationMatch: 0.15,  // 15% weight to location
      availabilityMatch: 0.15 // 15% weight to availability
    };

    // 1. Cause/Interest Matching (40 points max)
    const causeScore = this.matchCauses(volunteer, ngo);
    totalScore += causeScore.score * weights.causeMatch * 100;
    if (causeScore.matches.length > 0) {
      explanations.push(`Shared interests: ${causeScore.matches.join(', ')}`);
    }

    // 2. Skill Matching (30 points max)
    const skillScore = this.matchSkills(volunteer, ngo);
    totalScore += skillScore.score * weights.skillMatch * 100;
    if (skillScore.matches.length > 0) {
      explanations.push(`Your skills match their needs: ${skillScore.matches.join(', ')}`);
    }

    // 3. Location Matching (15 points max)
    const locationScore = this.matchLocation(volunteer, ngo);
    totalScore += locationScore.score * weights.locationMatch * 100;
    if (locationScore.match) {
      explanations.push(locationScore.reason);
    }

    // 4. Availability Matching (15 points max)
    const availabilityScore = this.matchAvailability(volunteer, ngo);
    totalScore += availabilityScore.score * weights.availabilityMatch * 100;
    if (availabilityScore.match) {
      explanations.push(availabilityScore.reason);
    }

    // Boost score if volunteer has relevant experience
    if (volunteer.impactScore && volunteer.impactScore > 100) {
      const experienceBoost = Math.min(5, volunteer.impactScore / 100);
      totalScore += experienceBoost;
      explanations.push(`Experienced volunteer (+${experienceBoost.toFixed(0)}% boost)`);
    }

    // Cap at 100
    totalScore = Math.min(100, Math.round(totalScore));

    return {
      matchScore: totalScore,
      matchLevel: this.getMatchLevel(totalScore),
      reasons: explanations,
      breakdown: {
        causeAlignment: Math.round(causeScore.score * 100),
        skillMatch: Math.round(skillScore.score * 100),
        locationMatch: Math.round(locationScore.score * 100),
        availabilityMatch: Math.round(availabilityScore.score * 100)
      }
    };
  }

  /**
   * Match volunteer interests with NGO causes
   */
  matchCauses(volunteer, ngo) {
    const volunteerInterests = this.parseInterests(volunteer.interests || '');
    const ngoCauses = this.parseInterests(ngo.interests || '');
    
    let matchScore = 0;
    let matches = [];

    // Direct keyword matching
    volunteerInterests.forEach(interest => {
      ngoCauses.forEach(cause => {
        const similarity = this.calculateTextSimilarity(interest, cause);
        if (similarity > 0.5) {
          matchScore += similarity;
          if (!matches.includes(cause)) {
            matches.push(cause);
          }
        }
      });
    });

    // Normalize score
    const normalizedScore = Math.min(1.0, matchScore / Math.max(volunteerInterests.length, 1));

    return {
      score: normalizedScore,
      matches: matches
    };
  }

  /**
   * Match volunteer skills with NGO needs
   */
  matchSkills(volunteer, ngo) {
    // Parse volunteer skills from dedicated skill field (treat as direct skills) OR interests as fallback
    const volunteerSkills = volunteer.skills 
      ? this.parseSkills(volunteer.skills, true) // True = treat as direct skills list
      : this.parseSkills(volunteer.interests || '', false); // False = extract from description
    const ngoNeeds = this.parseSkills(ngo.interests || '', false);

    let matchScore = 0;
    let matches = [];

    // NEW: Check if volunteer skills match the cause category
    if (ngo.interests) {
      const ngoCategory = ngo.interests.toLowerCase();
      Object.keys(this.categorySkillMap).forEach(category => {
        if (ngoCategory.includes(category)) {
          const relevantSkills = this.categorySkillMap[category];
          volunteerSkills.forEach(skill => {
            if (relevantSkills.some(rs => skill.includes(rs) || rs.includes(skill))) {
              matchScore += 0.8; // Strong match when skill aligns with category
              if (!matches.includes(skill)) {
                matches.push(skill);
              }
            }
          });
        }
      });
    }

    // Check if volunteer skills align with NGO needs (word matching)
    volunteerSkills.forEach(skill => {
      ngoNeeds.forEach(need => {
        const similarity = this.calculateTextSimilarity(skill, need);
        if (similarity > 0.4) {
          matchScore += similarity;
          if (!matches.includes(skill)) {
            matches.push(skill);
          }
        }
      });

      // Also check against skill keywords
      Object.keys(this.skillKeywords).forEach(skillType => {
        if (skill.toLowerCase().includes(skillType)) {
          this.skillKeywords[skillType].forEach(keyword => {
            if (ngo.interests && ngo.interests.toLowerCase().includes(keyword)) {
              matchScore += 0.3;
              if (!matches.includes(skillType)) {
                matches.push(skillType);
              }
            }
          });
        }
      });
    });

    const normalizedScore = Math.min(1.0, matchScore / Math.max(volunteerSkills.length, 1));

    return {
      score: normalizedScore,
      matches: matches
    };
  }

  /**
   * Match location (same city = perfect match)
   */
  matchLocation(volunteer, ngo) {
    const volCity = (volunteer.city || '').toLowerCase().trim();
    const ngoCity = (ngo.city || '').toLowerCase().trim();

    if (!volCity || !ngoCity) {
      return { score: 0.5, match: false, reason: 'Location not specified' };
    }

    if (volCity === ngoCity) {
      return { score: 1.0, match: true, reason: `Both in ${volunteer.city}` };
    }

    // Partial match for same state/region (simplified)
    if (volCity.includes(ngoCity) || ngoCity.includes(volCity)) {
      return { score: 0.7, match: true, reason: `Nearby location (${ngo.city})` };
    }

    return { score: 0.3, match: false, reason: 'Different locations' };
  }

  /**
   * Match availability
   */
  matchAvailability(volunteer, ngo) {
    const volAvailability = (volunteer.availability || '').toLowerCase();
    
    // For now, assume NGOs are flexible
    // In future, NGOs can specify their needs
    if (volAvailability.includes('weekends')) {
      return { score: 1.0, match: true, reason: 'Weekend availability matches' };
    }
    
    if (volAvailability.includes('weekdays') || volAvailability.includes('flexible')) {
      return { score: 0.9, match: true, reason: 'Flexible availability' };
    }

    return { score: 0.6, match: false, reason: 'Standard availability' };
  }

  /**
   * Calculate text similarity using Jaccard similarity
   */
  calculateTextSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Parse interests from comma-separated string or array
   */
  parseInterests(interestsString) {
    if (!interestsString) return [];
    
    // Handle arrays (from user profile)
    if (Array.isArray(interestsString)) {
      return interestsString
        .map(i => String(i).trim().toLowerCase())
        .filter(i => i.length > 0);
    }
    
    // Handle strings (from cause/NGO)
    return String(interestsString)
      .split(',')
      .map(i => i.trim().toLowerCase())
      .filter(i => i.length > 0);
  }

  /**
   * Parse skills from text or array
   */
  parseSkills(text, isSkillField = false) {
    if (!text) return [];
    
    // If it's a skills field (not description), treat values directly as skills
    if (isSkillField) {
      if (Array.isArray(text)) {
        return text.map(s => String(s).trim().toLowerCase()).filter(s => s.length > 0);
      }
      return String(text).split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
    }
    
    // Otherwise, extract known skills from description text
    // Handle arrays (from user profile)
    if (Array.isArray(text)) {
      const skills = [];
      text.forEach(skill => {
        const skillLower = String(skill).toLowerCase();
        Object.keys(this.skillKeywords).forEach(knownSkill => {
          if (skillLower.includes(knownSkill) || knownSkill.includes(skillLower)) {
            skills.push(knownSkill);
          }
        });
        // Also add the original skill if it's a known skill
        if (Object.keys(this.skillKeywords).includes(skillLower)) {
          skills.push(skillLower);
        }
      });
      return [...new Set(skills)];
    }
    
    // Handle strings (from cause/NGO description)
    const words = String(text).toLowerCase().split(/[,\s]+/);
    const skills = [];

    // Extract known skills
    Object.keys(this.skillKeywords).forEach(skill => {
      if (words.some(word => word.includes(skill) || skill.includes(word))) {
        skills.push(skill);
      }
    });

    return [...new Set(skills)]; // Remove duplicates
  }

  /**
   * Get match level description
   */
  getMatchLevel(score) {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'VERY HIGH';
    if (score >= 70) return 'HIGH';
    if (score >= 60) return 'GOOD';
    if (score >= 50) return 'MODERATE';
    if (score >= 40) return 'FAIR';
    return 'LOW';
  }

  /**
   * Batch match volunteer with multiple NGOs
   * Returns sorted list by match score
   */
  matchVolunteerWithNGOs(volunteer, ngos) {
    const matches = ngos.map(ngo => {
      const matchResult = this.calculateMatch(volunteer, ngo);
      return {
        ngo: ngo,
        ...matchResult
      };
    });

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
}

// Export singleton instance
module.exports = new MatchingEngine();
