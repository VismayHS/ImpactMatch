/**
 * Authentication System Verification Script
 * Tests all authentication components and middleware
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    results.passed++;
    return true;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Missing: ${filePath}${colors.reset}`);
    results.failed++;
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}File not found: ${filePath}${colors.reset}`);
    results.failed++;
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const found = content.includes(searchString);

  if (found) {
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    results.passed++;
    return true;
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} ${description}`);
    console.log(`  ${colors.yellow}Could not find: "${searchString}"${colors.reset}`);
    results.warnings++;
    return false;
  }
}

async function verifyAuthSystem() {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 AUTHENTICATION SYSTEM VERIFICATION');
  console.log('='.repeat(60) + '\n');

  // 1. Check Login Components
  console.log(`${colors.cyan}📱 1. Dedicated Login Pages${colors.reset}`);
  checkFile('../client/src/components/auth/UserLogin.jsx', 'User Login Component');
  checkFile('../client/src/components/auth/NGOLogin.jsx', 'NGO Login Component');
  checkFile('../client/src/components/auth/AdminLogin.jsx', 'Admin Login Component');
  checkFileContent('../client/src/components/auth/UserLogin.jsx', 'from-green-500 to-blue-500', 'User Login has green/blue theme');
  checkFileContent('../client/src/components/auth/NGOLogin.jsx', 'from-orange-500 to-purple-500', 'NGO Login has orange/purple theme');
  checkFileContent('../client/src/components/auth/AdminLogin.jsx', 'from-gray-800 to-blue-900', 'Admin Login has dark/navy theme');
  console.log('');

  // 2. Check Role-Based Redirects
  console.log(`${colors.cyan}🔀 2. Role-Based Redirects${colors.reset}`);
  checkFileContent('../client/src/components/auth/UserLogin.jsx', "navigate('/dashboard/user')", 'User redirects to /dashboard/user');
  checkFileContent('../client/src/components/auth/NGOLogin.jsx', "navigate('/dashboard/ngo')", 'NGO redirects to /dashboard/ngo');
  checkFileContent('../client/src/components/auth/AdminLogin.jsx', "navigate('/dashboard/admin')", 'Admin redirects to /dashboard/admin');
  checkFileContent('../client/src/components/auth/UserLogin.jsx', 'localStorage.setItem', 'User login stores data in localStorage');
  console.log('');

  // 3. Check NGO Verification System
  console.log(`${colors.cyan}✅ 3. NGO Certification Status${colors.reset}`);
  checkFile('../client/src/components/NGOVerificationBanner.jsx', 'NGO Verification Banner Component');
  checkFileContent('../client/src/components/NGOVerificationBanner.jsx', 'NGOFeatureGate', 'Feature gating component exists');
  checkFileContent('../client/src/components/NGOVerificationBanner.jsx', 'user.verified', 'Checks verification status');
  checkFileContent('../client/src/components/NGOVerificationBanner.jsx', 'Feature Locked', 'Shows locked state for pending NGOs');
  console.log('');

  // 4. Check JWT Middleware
  console.log(`${colors.cyan}🔒 4. JWT Role Protection Middleware${colors.reset}`);
  checkFile('./middleware/auth.js', 'Auth Middleware File');
  checkFileContent('./middleware/auth.js', 'verifyRole', 'verifyRole middleware exists');
  checkFileContent('./middleware/auth.js', 'verifyNGOApproved', 'verifyNGOApproved middleware exists');
  checkFileContent('./middleware/auth.js', 'authMiddleware', 'authMiddleware exists');
  
  // Also check utils/auth.js
  checkFile('./utils/auth.js', 'Auth Utils File');
  checkFileContent('./utils/auth.js', 'verifyRole', 'verifyRole in utils');
  checkFileContent('./utils/auth.js', 'verifyNGOApproved', 'verifyNGOApproved in utils');
  checkFileContent('./utils/auth.js', 'generateToken', 'generateToken function exists');
  console.log('');

  // 5. Check Logout & Session
  console.log(`${colors.cyan}🚪 5. Logout & Session Timeout${colors.reset}`);
  checkFileContent('./utils/auth.js', 'TokenExpiredError', 'Handles token expiry');
  checkFileContent('./utils/auth.js', 'suspended', 'Checks suspended accounts');
  checkFileContent('../client/src/components/auth/UserLogin.jsx', 'localStorage.removeItem', 'Can clear localStorage');
  console.log('');

  // 6. Check Forgot Password
  console.log(`${colors.cyan}🔑 6. Forgot Password Flow${colors.reset}`);
  checkFile('../client/src/components/auth/ForgotPassword.jsx', 'Forgot Password Component');
  checkFileContent('../client/src/components/auth/ForgotPassword.jsx', '/users/forgot-password', 'Forgot password endpoint configured');
  checkFileContent('../client/src/components/auth/ForgotPassword.jsx', 'success', 'Has success state');
  console.log('');

  // 7. Check UI Themes
  console.log(`${colors.cyan}🎨 7. Role-Specific UI Themes${colors.reset}`);
  checkFileContent('../client/src/components/auth/UserLogin.jsx', 'green', 'User theme includes green');
  checkFileContent('../client/src/components/auth/NGOLogin.jsx', 'orange', 'NGO theme includes orange');
  checkFileContent('../client/src/components/auth/AdminLogin.jsx', 'gray-800', 'Admin theme includes dark colors');
  console.log('');

  // 8. Check Integration Points
  console.log(`${colors.cyan}🔌 8. Integration Checks${colors.reset}`);
  checkFile('../client/src/App.jsx', 'App.jsx exists');
  
  // Check if new login pages are imported in App.jsx
  const appPath = path.join(__dirname, '../client/src/App.jsx');
  if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    if (appContent.includes('UserLogin') && appContent.includes('auth/UserLogin')) {
      console.log(`${colors.green}✓${colors.reset} UserLogin imported in App.jsx`);
      results.passed++;
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} UserLogin NOT imported in App.jsx`);
      console.log(`  ${colors.yellow}Action needed: Add import UserLogin from './components/auth/UserLogin'${colors.reset}`);
      results.warnings++;
    }

    if (appContent.includes('/login/user') && appContent.includes('/login/ngo') && appContent.includes('/login/admin')) {
      console.log(`${colors.green}✓${colors.reset} Role-specific login routes configured`);
      results.passed++;
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} Role-specific login routes NOT configured`);
      console.log(`  ${colors.yellow}Action needed: Add routes for /login/user, /login/ngo, /login/admin${colors.reset}`);
      results.warnings++;
    }

    if (appContent.includes('PrivateRoute')) {
      console.log(`${colors.green}✓${colors.reset} PrivateRoute component integrated`);
      results.passed++;
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} PrivateRoute exists but may need enhancement`);
      results.warnings++;
    }
  }
  console.log('');

  // 9. Check Backend Routes
  console.log(`${colors.cyan}🛡️ 9. Backend Route Protection${colors.reset}`);
  const routeFiles = [
    './routes/userRoutes.js',
    './routes/causeRoutes.js',
    './routes/verifyRoutes.js',
    './routes/adminRoutes.js',
  ];

  let protectedRoutes = 0;
  routeFiles.forEach(routeFile => {
    const routePath = path.join(__dirname, routeFile);
    if (fs.existsSync(routePath)) {
      const content = fs.readFileSync(routePath, 'utf8');
      if (content.includes('authMiddleware') || content.includes('verifyRole') || content.includes('verifyNGOApproved')) {
        protectedRoutes++;
      }
    }
  });

  if (protectedRoutes > 0) {
    console.log(`${colors.green}✓${colors.reset} ${protectedRoutes} route files use auth middleware`);
    results.passed++;
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} No route files using new auth middleware detected`);
    console.log(`  ${colors.yellow}Action needed: Apply verifyRole() and verifyNGOApproved to backend routes${colors.reset}`);
    results.warnings++;
  }

  // Check for forgot-password endpoint
  const userRoutesPath = path.join(__dirname, './routes/userRoutes.js');
  if (fs.existsSync(userRoutesPath)) {
    const content = fs.readFileSync(userRoutesPath, 'utf8');
    if (content.includes('forgot-password')) {
      console.log(`${colors.green}✓${colors.reset} Forgot password endpoint exists`);
      results.passed++;
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} Forgot password endpoint NOT implemented`);
      console.log(`  ${colors.yellow}Action needed: Add POST /api/users/forgot-password route${colors.reset}`);
      results.warnings++;
    }
  }
  console.log('');

  // 10. Check Documentation
  console.log(`${colors.cyan}📚 10. Documentation${colors.reset}`);
  checkFile('../AUTHENTICATION_SYSTEM.md', 'Authentication system documentation');
  console.log('');

  // Print Summary
  console.log('='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`${colors.green}✓ Passed:${colors.reset}   ${results.passed}`);
  console.log(`${colors.yellow}⚠ Warnings:${colors.reset} ${results.warnings}`);
  console.log(`${colors.red}✗ Failed:${colors.reset}   ${results.failed}`);
  console.log('');

  if (results.warnings > 0) {
    console.log(`${colors.yellow}⚠ INTEGRATION INCOMPLETE${colors.reset}`);
    console.log('The authentication system components are created but not fully integrated.');
    console.log('Review the warnings above for required integration steps.');
  } else if (results.failed > 0) {
    console.log(`${colors.red}✗ VERIFICATION FAILED${colors.reset}`);
    console.log('Some required files are missing. Review the failures above.');
  } else {
    console.log(`${colors.green}✅ ALL CHECKS PASSED!${colors.reset}`);
    console.log('Authentication system is fully implemented and ready to use.');
  }
  console.log('');

  // Next Steps
  if (results.warnings > 0 || results.failed > 0) {
    console.log('='.repeat(60));
    console.log('🚀 NEXT STEPS');
    console.log('='.repeat(60));
    
    if (results.warnings > 0) {
      console.log('\n1. Update App.jsx with new login routes:');
      console.log('   - Import UserLogin, NGOLogin, AdminLogin, ForgotPassword');
      console.log('   - Add routes: /login/user, /login/ngo, /login/admin, /forgot-password');
      console.log('   - Enhance PrivateRoute to check roles');
      
      console.log('\n2. Protect backend routes:');
      console.log('   - Apply verifyRole() middleware to role-specific routes');
      console.log('   - Apply verifyNGOApproved to NGO feature routes');
      console.log('   - Implement /api/users/forgot-password endpoint');
      
      console.log('\n3. Integrate NGO verification banner:');
      console.log('   - Import NGOVerificationBanner into NGO dashboard');
      console.log('   - Wrap restricted features with NGOFeatureGate');
    }
    console.log('\nSee AUTHENTICATION_SYSTEM.md for detailed integration instructions.');
    console.log('');
  }
}

// Run verification
verifyAuthSystem().catch(console.error);
