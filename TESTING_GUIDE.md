# 🧪 TESTING GUIDE - ImpactMatch Dashboards

## Quick Start
Both servers are already running:
- **Frontend**: http://localhost:3000/
- **Backend**: http://localhost:5173/api

---

## 📋 COMPLETE TESTING CHECKLIST

### 1. User Dashboard Testing (6 pages)

#### 1.1 User Discover (Tinder Swipe)
**URL**: `/user-dashboard` (default route)

- [ ] **Swipe Right (Join)**: Drag card right or press → arrow key
- [ ] **Swipe Left (Skip)**: Drag card left or press ← arrow key
- [ ] **Card Stack**: Verify multiple cards display (max 3 visible)
- [ ] **Join Action**: Verify toast notification after join
- [ ] **Data Refresh**: Verify new causes load after swipes
- [ ] **Empty State**: Verify message when no more causes available
- [ ] **Filters Exclude**: Already-joined causes should not appear

**Expected**: Smooth animations, successful API calls to POST `/api/matches`

---

#### 1.2 My Causes
**URL**: `/user-dashboard/my-causes`

- [ ] **Cause List**: All joined causes display in table
- [ ] **Verification Badge**: Green badge shows for verified causes
- [ ] **Stats Cards**: Total, Verified, Pending counts are accurate
- [ ] **Filter Buttons**: 'All', 'Verified', 'Pending' tabs work
- [ ] **Blockchain Hash**: Truncated hash displays (first 12 + last 8 chars)
- [ ] **Date Format**: Join dates display correctly
- [ ] **Empty State**: Message shows if no causes joined

**Expected**: Accurate counts, filtering works, verification status correct

---

#### 1.3 Impact Score (Badge System)
**URL**: `/user-dashboard/impact-score`

- [ ] **Badge Display**: Current badge shows based on causes joined:
  - 1 cause = Newcomer
  - 3 causes = Contributor
  - 5 causes = Dedicated
  - 10 causes = Champion
  - 20 causes = Impact Hero
  - 50 causes = Legend
- [ ] **Confetti Animation**: Triggers if score > 100
- [ ] **Progress Bar**: Shows progress to next level (100 pts/level)
- [ ] **Stats Grid**: 4 cards (causes, verified, hours, score)
- [ ] **Score Formula**: `(causes * 10) + (verified * 25) + hours`
- [ ] **Badge Requirements**: Requirements list shows all 6 badges

**Expected**: Confetti plays on high scores, badge unlocks correctly

---

#### 1.4 User Analytics
**URL**: `/user-dashboard/analytics`

- [ ] **Timeline Chart**: 30-day LineChart shows join activity
- [ ] **Category Pie Chart**: Category distribution displays
- [ ] **Insights Cards**: 
  - Most active category calculated
  - This month count accurate
  - Favorite category determined
- [ ] **Chart Hover**: Tooltip shows on hover over chart elements
- [ ] **Date Range**: Last 30 days of data visible

**Expected**: Charts render correctly, insights calculated accurately

---

#### 1.5 Blockchain Proofs
**URL**: `/user-dashboard/blockchain-proofs`

- [ ] **Verification Table**: All verified causes display
- [ ] **Search Function**: Filter by cause name, NGO name, or hash
- [ ] **Copy Hash**: Click copy icon, verify toast notification
- [ ] **Download JSON**: Click download, verify file downloads
- [ ] **View on Blockchain**: External link opens (mock explorer)
- [ ] **Hash Display**: Truncated format `xxx...xxx`
- [ ] **Date Column**: Verification dates display

**Expected**: Search works, copy to clipboard functions, JSON download successful

---

#### 1.6 Share Impact
**URL**: `/user-dashboard/share-impact`

- [ ] **Template Selection**: 4 templates (Gradient, Ocean, Sunset, Forest)
- [ ] **Active Indicator**: Selected template has ring border
- [ ] **Impact Card**: 
  - User name displays
  - 4 stat cards show correct values
  - Decorative circles visible
- [ ] **Social Share Links**:
  - Twitter: Opens Twitter intent
  - Facebook: Opens Facebook sharer
  - LinkedIn: Opens LinkedIn share
  - Instagram: Shows copy link notification
- [ ] **Copy Link**: Profile link copies to clipboard

**Expected**: All social links open correctly, template switching works

---

### 2. Admin Dashboard Testing (7 pages)

#### 2.1 Admin Overview
**URL**: `/admin-dashboard` (default route)

- [ ] **Stats Cards**: 
  - Total users (exclude NGOs/admins)
  - Total NGOs
  - Pending NGOs count
  - Total causes
  - Total verifications
- [ ] **7-Day Activity Chart**: LineChart shows last 7 days of joins
- [ ] **Recent Activity Feed**: Last 10 matches with user/cause names
- [ ] **Pending NGO Alert**: Yellow banner if pending NGOs > 0
- [ ] **Map Display**: React Leaflet map loads (optional)

**Expected**: Accurate aggregated stats, chart renders, activity feed updates

---

#### 2.2 NGO Management
**URL**: `/admin-dashboard/ngo-management`

- [ ] **NGO List**: All NGOs display (verified and pending)
- [ ] **Filter Tabs**: 'All', 'Pending', 'Verified' buttons work
- [ ] **Stats Cards**: Total, Verified, Pending counts accurate
- [ ] **Approve Action**: 
  - Click approve button
  - Verify PUT request to `/api/users/:id` with `verified: true`
  - Verify toast notification
  - Verify list refreshes
- [ ] **Reject Action**:
  - Click reject button
  - Verify confirmation dialog
  - Verify DELETE request to `/api/users/:id`
  - Verify toast notification
  - Verify NGO removed from list
- [ ] **View Certificate**: External link opens certificate PDF

**Expected**: Approve/reject actions work, data refreshes after actions

---

#### 2.3 User Management
**URL**: `/admin-dashboard/user-management`

- [ ] **User Table**: All users display (exclude NGOs/admins)
- [ ] **Filter Tabs**: 'All', 'Active', 'Suspended' buttons work
- [ ] **Stats Cards**: Total, Active, Suspended counts accurate
- [ ] **Suspend Action**:
  - Click suspend button
  - Verify PUT request to `/api/users/:id` with `suspended: true`
  - Verify toast notification
  - Verify status badge changes to red
  - Verify list refreshes
- [ ] **Status Badges**: 
  - Green for active users
  - Red for suspended users
- [ ] **Date Format**: Join dates display correctly

**Expected**: Suspend action works, filtering accurate, status updates

---

#### 2.4 Cause Management
**URL**: `/admin-dashboard/cause-management`

- [ ] **Cause List**: All causes display with details
- [ ] **Filter Tabs**: 'All', 'Active', 'Pending', 'Flagged' buttons work
- [ ] **Stats Cards**: Total, Active, Pending, Flagged counts accurate
- [ ] **Flag Action**:
  - Click flag button
  - Verify confirmation dialog
  - Verify PUT request to `/api/causes/:id` with `status: 'flagged'`
  - Verify toast notification
  - Verify status badge changes to red
- [ ] **Remove Action**:
  - Click remove button
  - Verify confirmation dialog
  - Verify DELETE request to `/api/causes/:id`
  - Verify toast notification
  - Verify cause removed from list
- [ ] **Cause Details**: Title, description, NGO name, city, category display

**Expected**: Flag/remove actions work, data refreshes, confirmations show

---

#### 2.5 Blockchain Tracker
**URL**: `/admin-dashboard/blockchain`

- [ ] **Verification Table**: All platform verifications display
- [ ] **Stats Cards**: 
  - Total verifications
  - Last 24 hours count
  - Unique users count
- [ ] **Search Function**: Filter by user, cause, NGO, or hash
- [ ] **Filter Tabs**: 'All', 'Recent' (last 24h) buttons work
- [ ] **Copy Hash**: Click copy icon, verify toast notification
- [ ] **Download Proof**: Click download, verify JSON file downloads
- [ ] **View on Blockchain**: External link opens (mock explorer)
- [ ] **Data Enrichment**: User names, cause names, NGO names display

**Expected**: Search works, download successful, all data enriched correctly

---

#### 2.6 Anomaly Detection (AI Monitoring)
**URL**: `/admin-dashboard/anomaly`

- [ ] **Detection Rules**: 5 rules execute:
  1. User >5 causes in 1 hour (Critical)
  2. User >3 verifications in 24h (Warning)
  3. NGO no active causes after 7 days (Info)
  4. Cause >50 volunteers in 1 week (Warning)
  5. New account >3 causes in 1 hour (Critical)
- [ ] **Stats Cards**: Critical, Warning, Info counts
- [ ] **Anomaly Cards**: 
  - Correct alert type (critical/warning/info)
  - Description accurate
  - Recommended action displays
  - Timestamp shows
- [ ] **Re-scan Button**: Click to re-run detection
- [ ] **Empty State**: "All Clear" message if no anomalies
- [ ] **Color Coding**: 
  - Red border/badge for critical
  - Yellow for warning
  - Blue for info

**Expected**: Rules detect anomalies, alerts display correctly, re-scan works

---

#### 2.7 Export Reports (PDF Generation)
**URL**: `/admin-dashboard/reports`

- [ ] **Stats Cards**: Total users, NGOs, causes, verifications display
- [ ] **Platform Report**:
  - Click "Generate PDF" button
  - Verify loading spinner shows
  - Verify PDF downloads
  - Open PDF, verify:
    - Platform overview table
    - Top NGOs by causes
    - Top 10 causes by volunteers
    - Recent activity (last 15 joins)
  - Verify toast notification
- [ ] **User Analytics Report**:
  - Click "Generate PDF" button
  - Verify PDF downloads
  - Open PDF, verify:
    - User engagement statistics
    - Top 10 active users
    - Verifications per user
  - Verify toast notification
- [ ] **NGO Performance Report**:
  - Click "Generate PDF" button
  - Verify PDF downloads
  - Open PDF, verify:
    - NGO overview statistics
    - NGO performance details table
    - Verified status column
  - Verify toast notification
- [ ] **PDF Quality**: 
  - Headers formatted correctly
  - Tables use striped theme
  - Page numbers display
  - Data accurate

**Expected**: All 3 PDFs generate successfully, data is accurate and formatted well

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Failed to fetch" errors
**Fix**: Verify backend is running on port 5173
```bash
cd c:\Users\visma\Downloads\ImpactMatch\impactmatch
npm start
```

### Issue: No causes appear in swipe interface
**Fix**: 
1. Check if causes exist in database
2. Check if user has already joined all causes
3. Verify GET `/api/causes` returns data

### Issue: Confetti doesn't trigger
**Fix**: Verify impact score > 100 by joining enough causes

### Issue: PDF download fails
**Fix**: Check browser console for jsPDF errors, verify data loads correctly

### Issue: Social share links don't work
**Fix**: Verify links open in new tab (some may require authentication)

### Issue: Anomaly detection shows "All Clear" incorrectly
**Fix**: Create test data that matches anomaly rules (e.g., join >5 causes quickly)

---

## 📊 TEST DATA REQUIREMENTS

To fully test all features, ensure database has:

- **Users**: At least 10 users with role 'user'
- **NGOs**: At least 5 NGOs (some verified, some pending)
- **Causes**: At least 20 causes from various NGOs
- **Matches**: Multiple user-cause joins with recent timestamps
- **Verifications**: Some matches verified with blockchain hashes

**Quick Test Data Creation**:
1. Register multiple users via frontend
2. Register multiple NGOs via frontend
3. Admin approves NGOs
4. NGOs create causes
5. Users join causes via swipe interface
6. Admin creates verifications

---

## ✅ SUCCESS CRITERIA

All tests pass when:
- ✅ No console errors in browser
- ✅ All API calls return 200 status
- ✅ All toast notifications display correctly
- ✅ All animations play smoothly
- ✅ All data displays accurately
- ✅ All actions (approve/reject/suspend/join) work
- ✅ All filters and searches function
- ✅ All downloads/copies work
- ✅ All charts render correctly
- ✅ All PDFs generate successfully

---

## 📸 SCREENSHOTS TO CAPTURE

For documentation:
1. User Discover - Swipe interface with card
2. Impact Score - Badge with confetti
3. User Analytics - Charts
4. Share Impact - Social share card
5. Admin Overview - Platform stats
6. NGO Management - Approval interface
7. Anomaly Detection - Alert cards
8. Export Reports - Generated PDF

---

## 🚀 TESTING ORDER

Recommended testing sequence:

1. **Start with User Dashboard**:
   - Discover (join causes)
   - My Causes (verify joins)
   - Impact Score (check badge)
   - Analytics (view charts)
   - Blockchain Proofs (download)
   - Share Impact (social links)

2. **Then Admin Dashboard**:
   - Overview (check stats)
   - NGO Management (approve/reject)
   - User Management (suspend user)
   - Cause Management (flag/remove)
   - Blockchain Tracker (search)
   - Anomaly Detection (view alerts)
   - Export Reports (generate PDFs)

3. **Finally Cross-Dashboard Testing**:
   - Admin approves NGO → NGO can create causes
   - User joins cause → appears in My Causes
   - Admin suspends user → user blocked from actions
   - Admin flags cause → status reflects everywhere

---

**Status**: Ready for comprehensive testing!  
**Servers**: Both running (Frontend: 3000, Backend: 5173)  
**Documentation**: See DASHBOARDS_COMPLETE.md for detailed feature list

*Testing Time Estimate: 1-2 hours for complete coverage*
