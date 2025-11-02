# Category & City Filtering Implementation ✅

## Overview
Implemented personalized cause filtering based on user's selected **categories** and **cities**. Users can now customize their preferences and the swipe feature will only show matching causes.

## Features Implemented

### 1. User Preferences Page (`UserPreferences.jsx`)
- **Categories Section**: 10 fixed categories with pink gradient buttons
  - environment, health, education, animals, sports
  - women empowerment, technology, volunteering, children, youth
- **Cities Section**: 10 fixed cities with blue gradient buttons
  - Bangalore, Mumbai, Jaipur, Delhi, Kolkata
  - Surat, Chennai, Pune, Lucknow, Hyderabad
- **Live Preview**: Shows selected preferences summary
- **Persistence**: Saves to both database and localStorage

### 2. Backend Filtering Logic

#### User Model (`models/User.js`)
```javascript
selectedCategories: [{
  type: String, // Array of selected cause categories
}],
selectedCities: [{
  type: String, // Array of selected cities
}]
```

#### API Endpoint (`routes/causeRoutes.js`)
- **Route**: `GET /api/causes/personalized`
- **Auth**: Required (JWT token)
- **Returns**: Filtered causes matching BOTH category AND city preferences

#### Filtering Algorithm (`utils/tfidfMatcher.js`)
```javascript
function filterCausesByPreferences(causes, selectedCategories, selectedCities) {
  // Filters causes that match:
  // 1. At least one selected category (if categories are selected)
  // 2. At least one selected city (if cities are selected)
  // 3. If no preferences selected, returns all causes
}
```

**Filtering Logic**:
- **Both filters active**: Cause must match selected category AND selected city
- **Only categories selected**: Cause must match selected category
- **Only cities selected**: Cause must match selected city
- **No preferences**: Returns all causes

### 3. Swipe Feature Integration

The swipe feature (`UserDiscover.jsx` and `SwipePage.jsx`) already uses the `/api/causes/personalized` endpoint, so it will **automatically** show only filtered causes!

## How It Works

### User Flow:
1. User goes to **Preferences** page
2. Selects interested categories (e.g., environment, health, education)
3. Selects preferred cities (e.g., Bangalore, Mumbai, Delhi)
4. Clicks **Save Preferences**
5. Goes to **Discover Causes** (swipe feature)
6. Sees **ONLY** causes matching their selections

### Example:
**User Selects**:
- Categories: environment, health
- Cities: Bangalore, Mumbai

**Result**: Swipe cards will show ONLY:
- Environment causes in Bangalore
- Environment causes in Mumbai
- Health causes in Bangalore
- Health causes in Mumbai

**Filtered Out**:
- Education causes (category doesn't match)
- Health causes in Delhi (city doesn't match)

## Testing

### Test Case 1: Category Filter
1. Go to Preferences
2. Select only "environment" category
3. Select all cities
4. Save
5. Go to Discover Causes
6. **Expected**: Only environment causes appear

### Test Case 2: City Filter
1. Go to Preferences
2. Select all categories
3. Select only "Bangalore" city
4. Save
5. Go to Discover Causes
6. **Expected**: Only Bangalore causes appear

### Test Case 3: Combined Filter
1. Go to Preferences
2. Select "health" and "education" categories
3. Select "Mumbai" and "Delhi" cities
4. Save
5. Go to Discover Causes
6. **Expected**: Only health/education causes in Mumbai/Delhi appear

### Test Case 4: No Preferences
1. Go to Preferences
2. Click "Clear All"
3. Save (with nothing selected)
4. Go to Discover Causes
5. **Expected**: All active causes appear (no filtering)

## Database Schema

### Categories (Fixed Enum)
```javascript
[
  'environment', 'health', 'education', 'animals', 'sports',
  'women empowerment', 'technology', 'volunteering', 'children', 'youth'
]
```

### Cities (Fixed Enum)
```javascript
[
  'Bangalore', 'Mumbai', 'Jaipur', 'Delhi', 'Kolkata',
  'Surat', 'Chennai', 'Pune', 'Lucknow', 'Hyderabad'
]
```

## Logging & Debugging

The backend includes extensive logging:
```
🔍 PERSONALIZED CAUSES REQUEST (CATEGORY + CITY BASED):
  User ID: 673e9f8a7e3b4c5d6e7f8a9b
  Selected Categories: ['environment', 'health']
  Selected Cities: ['Bangalore', 'Mumbai']
  Total active causes: 200

🔍 CATEGORY + CITY FILTER INPUT:
  totalCauses: 200
  selectedCategories: ['environment', 'health']
  selectedCities: ['Bangalore', 'Mumbai']

✅ PASSED: "Beach Cleanup Drive" [environment] in Mumbai
✅ PASSED: "Free Health Checkup Camp" [health] in Bangalore
❌ FILTERED OUT: "Tree Plantation" [environment] in Delhi (city mismatch)
❌ FILTERED OUT: "Coding Workshop" [education] in Mumbai (category mismatch)

✅ FILTER OUTPUT: 45 causes passed filter
```

## Files Modified

### Frontend:
1. `client/src/components/dashboards/user/UserPreferences.jsx`
   - Added categories section
   - Updated state management
   - Updated save/load logic

2. `client/src/components/Dashboard.jsx`
   - Added fixed categories constant
   - Removed API call for filter options

3. `client/src/components/dashboards/organisation/OrganisationCauses.jsx`
   - Added fixed cities constant
   - Removed API call for filter options

### Backend:
1. `impactmatch/models/User.js`
   - Added `selectedCategories` field

2. `impactmatch/routes/causeRoutes.js`
   - Updated `/personalized` endpoint to fetch categories
   - Updated logging

3. `impactmatch/utils/tfidfMatcher.js`
   - Updated `filterCausesByPreferences()` for dual filtering
   - Updated `getPersonalizedCauses()` to pass categories

## Status: ✅ COMPLETE

All features implemented and tested:
- ✅ Category selection UI
- ✅ City selection UI
- ✅ Preferences persistence (DB + localStorage)
- ✅ Backend filtering logic
- ✅ Swipe feature integration
- ✅ No 404 errors
- ✅ Server restarted with new code

## Next Steps (Optional Enhancements)

1. **Add visual feedback** in swipe cards showing why a cause matched (e.g., "Matches your interest: Environment")
2. **Add counter** showing how many causes match preferences
3. **Add "Edit Preferences"** quick link from Discover page
4. **Add preference badges** on user profile
5. **Analytics** - track which categories are most popular
