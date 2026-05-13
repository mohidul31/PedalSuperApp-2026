# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                        # Start Metro bundler
npm run android                  # Build and run on Android
npm run ios                      # Build and run on iOS
npm run lint                     # ESLint
npm test                         # Jest
npm start -- --reset-cache       # Clear Metro cache
```

iOS native setup (first time or when native deps change):
```bash
bundle install
bundle exec pod install
```

Node.js >= 22.11.0 required.

## Architecture

### Navigation

Authentication state drives the root navigator split:

```
AppNavigator (AuthProvider + NavigationContainer)
├── AuthStack                        # isAuthenticated = false
│   ├── LoginScreen                  # Phone + reference code modal
│   ├── RegistrationScreen
│   └── ProvideOTPScreen
└── MainStack                        # isAuthenticated = true
    └── Drawer Navigator (CustomDrawer)
        ├── HomeTabs (Bottom Tabs)
        │   ├── HomeScreen           # 3x3 feature card grid
        │   ├── OfferScreen
        │   ├── PedalScreen
        │   ├── SettingScreen
        │   └── AccountScreen
        ├── BudgetPlanStack (TabView)
        │   ├── MyBudgetScreen
        │   ├── IncomePlanScreen
        │   └── SummaryScreen
        └── SmeManagerStack
            └── SmeManagerLandingScreen → SMEDashboardScreen, StockManagerScreen, SellScreen
```

- `src/navigations/AppNavigator.jsx` — root; checks AsyncStorage for `access_token` on load
- `src/navigations/MainStack.jsx` — drawer + nested stacks
- `src/navigations/HomeTabs.jsx` — bottom tabs with Bengali labels and Ionicons
- `src/navigations/CustomDrawer.jsx` — sidebar with user profile
- `src/data/menuItems.js` — drives the HomeScreen 3x3 grid; cards set `screen` property or `UnderConstruction`

### State Management

Global state is minimal — only `AuthContext`:

```javascript
// src/context/AuthContext.js
{ isAuthenticated, setIsAuthenticated }
```

User profile data (username, email, phone) is stored in AsyncStorage but **not** in context.

**Auth flow:**
1. App load → check AsyncStorage for `access_token`
2. Login: `POST /token` with phone number → stores `access_token`, `refresh_token`, user fields
3. Logout: `AsyncStorage.multiRemove(keys)` clears all stored data
4. 401 responses trigger automatic token refresh via `POST /refresh-token` in the axios interceptor

**AsyncStorage keys:** `access_token`, `refresh_token`, `user_name`, `user_email`, `user_phone`

### API Layer

`src/api/index.js` — axios instance:
- **Base URL**: `https://pedal-api.turingsoft.net`
- Request interceptor: adds `Authorization: Bearer {token}` automatically
- Response interceptor: on 401, fetches new access token with refresh token, retries original request

Endpoints used:
- `POST /token` — login
- `POST /refresh-token` — token refresh
- `POST /api/User` — registration

### Key Patterns

**Authentication quirk:** Login requires phone number **and** a reference code entered via a modal. Valid codes are hardcoded in `LoginScreen.jsx` — update there if codes change.

**Phone validation:** Bangladeshi format — `/^01[3-9][0-9]{8}$/`

**Forms:** Formik + Yup throughout auth screens. Show field errors only when `touched && errors` both true.

**Feedback:** All user feedback via `react-native-toast-message`. Pattern:
```javascript
Toast.show({ type: 'success', position: 'bottom', text1: 'Message', visibilityTime: 2000 });
```

**UI:** Bengali (Bangla) text is hardcoded directly in components — no i18n library. LinearGradient (blue) used on auth/loading screens. `src/styles/colors.js` defines the color palette; each component uses its own `StyleSheet.create()`.

**Unbuilt features:** Most HomeScreen grid items route to `UnderConstruction` — they show a toast warning instead of a real screen.
