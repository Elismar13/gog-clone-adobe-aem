# GOG Clone – Technical Specification for AI Agents

## 1. Purpose and Scope
This document provides an authoritative, machine-actionable overview of the current AEM SPA project so AI agents can navigate, extend, and maintain it safely. It describes architecture, key modules, data flows, configuration, and constraints.

## 2. System Architecture
- Frontend: React SPA embedded in Adobe Experience Manager (AEM) using AEM SPA Editor.
  - Entry: `ui.frontend/src/index.js`
  - App root: `ui.frontend/src/App.js` (extends AEM Page from `@adobe/aem-react-editable-components`)
  - Routing: `react-router-dom@5` with `Router`, `Switch`, `Route` in `index.js`
  - Client libs/CSS: Bootstrap 5 and custom CSS
- AEM Integration:
  - Page model retrieved via `@adobe/aem-spa-page-model-manager` (`ModelManager.initialize`)
  - Components are mapped and rendered by AEM SPA runtime (`./components/import-components`)
- State:
  - Cart state via `CartContext` in `src/state/CartContext.ts` (localStorage persistence)
  - Auth state via `AuthContext` in `src/state/AuthContext.tsx` (Keycloak integration)
- Authentication:
  - Keycloak integration via `keycloak-js` library
  - Login prompt component with configurable post-login redirect
  - JWT token parsing for user information
  - User profile component in header with dropdown menu


## 3. Content Model (AEM Content Fragments)
Defined in README and used by components/pages:
- Jogo: `title`, `description`, `price`, `score`, `discountValue`, `releaseDate`, `genre`, `developer`, `imageList`
- Desenvolvedor: `title`, `image`
- Destaque: `title`, `externalLink`, `image`

## 4. Frontend Modules and Responsibilities
- `src/index.js`
  - Initializes AEM `ModelManager` and Browser History
  - Mounts `CartProvider` and `AuthProvider`
  - Declares routes:
    - `GET /checkout` → `pages/Checkout`
    - `GET /login` → `pages/Login`
    - `GET /` (fallback) → AEM-controlled SPA (`App`)
  - Can host additional global utilities (e.g., telemetry) if needed
- `src/App.js`
  - AEM page container rendering `childComponents` and `childPages`
- `src/state/AuthContext.tsx`
  - `AuthProvider` with Keycloak integration
  - Public API via hook `useAuth()`:
    - `authenticated`, `initialized`, `token`, `userInfo`
    - `login`, `logout`
- `src/components/Navigation/Navigation.tsx`
  - Header/nav, embeds `MiniCart` and `UserProfile`
  - Conditional login button (shows when not authenticated)
  - Functional search bar with redirect to `/search.html?q=term`
  - Search integration with URL parameters and automatic routing
- `src/components/SearchFilter/SearchFilter.tsx`
  - Search page component with URL parameter reading
  - Automatic search execution when URL contains `?q=term`
  - Integration with existing filters and GraphQL API
  - Game filtering with sidebar (genre, developer, score, discount)
  - Grid display of search results with Gameitem components
- `src/components/UserProfile/UserProfile.tsx`
  - User avatar and name from Keycloak JWT
  - Dropdown menu with: profile, library, wishlist, orders, settings
  - Logout functionality
  - Quick stats (cart items, favorites, orders)
  - Updated color scheme using CSS variables (`--color-accent`, `--color-accent-hover`)
- `src/components/Cart/MiniCart.tsx`
  - Mini-cart dropdown: list items, edit quantities, remove, clear
  - Button "Finalizar compra"
    - Navega para `/checkout` (authenticated users)
    - Navega para página de login (unauthenticated users)
- `src/components/Checkout/Checkout.tsx`
  - Modular checkout with components:
    - `CheckoutHeader`: Header com título
    - `OrderSummary`: Resumo do pedido com itens e controle de quantidade
    - `PaymentForm`: Formulário de pagamento (cartão/PIX)
    - `AuthRequired`: Tela para usuários não autenticados
    - `EmptyCart`: Tela para carrinho vazio
  - Integração com `useAuth` e `useCart`
  - Cálculo automático de desconto de 10%
  - Advanced form validation and real-time formatting:
    - CPF: `123.456.789-11` automatic formatting
    - Credit card: `1234 5678 9012 3456` spacing
    - Expiry: `MM/AA` format
    - CEP: `12345-678` formatting
    - Phone: `(11) 11111-1111` automatic formatting
    - Email auto-lowercase and state uppercase conversion
  - Comprehensive validation with detailed error messages
  - Updated color scheme to GOG purple theme
- `src/components/LoginPrompt/LoginPrompt.tsx`
  - Componente AEM com propriedades configuráveis:
    - `gotoPath`: Destino pós-login
    - `postLoginDestination`: Página AEM para redirecionamento
    - `redirectionTimeout`: Tempo de espera (segundos)
    - `shouldRedirect`: Ativar/desativar redirecionamento
    - `showLogout`: Exibir botão de logout
  - Countdown visual com barra de progresso
  - Interface moderna com glassmorphism
  - Updated color scheme using CSS variables for better visual consistency
- `src/state/CartContext.ts`
  - `CartProvider` with reducer/persistence
  - Public API via hook `useCart()`:
    - `addItem`, `removeItem`, `updateQuantity`, `clear`, `total`, `items`
- `src/constants/constants.ts`
  - AEM host and page paths used by navigation/links
    - `STORE_PAGE_PATH`, `LOGIN_PAGE_PATH`, `CHECKOUT_PAGE_PATH`

## 5. Data Flow
- Content:
  - AEM → `ModelManager` → `App` → AEM components mapped in `./components/import-components`
- Cart:
  - UI components call `useCart()` → dispatch to reducer → persist to `localStorage` → derive `total`

## 6. External Dependencies
- React 16, react-router-dom 5
- AEM SPA packages (`@adobe/*`)
- Bootstrap 5


## 7. Configuration and Environment
- CRA env files (not committed to prod by default): `.env`, `.env.development`, etc.
- Important variables (read by frontend):
  - `PUBLIC_URL=/`
  - `REACT_APP_PROXY_ENABLED=true`
  - `REACT_APP_PAGE_MODEL_PATH=/content/gogstore/us/en.model.json`
  - `REACT_APP_API_HOST=http://localhost:4502`
  - `REACT_APP_ROOT=/content/gogstore/us/en/home.html`
- AEM client libs/CSS loaded via `public/index.html` and dispatcher

## 8. Routes and Navigation
- `/checkout` – Checkout page with payment forms (requires auth)
- `/login` – Login page with Keycloak integration
- `/search.html` – Search page with URL parameter support (`?q=term`)
- `/` fallback → AEM SPA (pages handled by AEM SPA editor)

### 8.1 Search Flow
1. User types in Navigation search bar → "Cyberpunk"
2. Presses Enter → Redirects to `/search.html?q=Cyberpunk`
3. SearchFilter component reads URL parameter and auto-executes search
4. Results displayed with existing filters available

## 9. Keycloak Authentication Configuration
- Environment variables for Keycloak:
  - `REACT_APP_KEYCLOAK_URL` – Keycloak server URL
  - `REACT_APP_KEYCLOAK_REALM` – Realm name
  - `REACT_APP_KEYCLOAK_CLIENT_ID` – Client ID for SPA
- Login flow:
  1. User clicks login button
  2. `AuthContext` calls `kc.login()` with redirectUri
  3. Keycloak redirects to login page
  4. After authentication, redirect back to app
  5. `LoginPrompt` component handles post-login redirect with countdown

## 10. Build, Run, Deploy
- Frontend: CRA scripts in `ui.frontend/package.json`
  - `start` (dev), `build` (build + clientlib generator), `sync` (aemsync)
- AEM: Maven build at repo root → deploy UI apps/content packages into AEM 6.5+
- Dispatcher: Not detailed here; assumed standard AEM dispatcher setup

## 11. Coding Conventions and Constraints
- React 16 + TypeScript files in some modules (TS lint errors may appear in IDE; runtime is JS-compatible)
- Do not break AEM SPA Editor contract in `App.js`/`ModelManager` usage
- Use `CartContext` for shopping cart state; do not create parallel state stores
- React Router v5 API only (no hooks like `useNavigate` from v6)

## 12. Security Considerations
- Validate/sanitize any user-generated content rendered in components
- Avoid storing sensitive credentials in the client; rely on AEM/dispatcher for protection of server endpoints
- Follow AEM dispatcher best practices for caching and access control

## 13. Extension Guidelines for AI Agents
- Adding a new page/route:
  1) Create component under `src/pages/YourPage.tsx`
  2) Add `<Route path="/your-page">` in `index.js`
  3) From UI, navigate with `history.push('/your-page')`
- Integrating a new AEM component:
  1) Implement React component under `src/components/...`
  2) Map it in `./components/import-components`
  3) Ensure Sling Model/Content Fragment delivers required fields
- Modifying authentication:
  - Use `useAuth()` API from `AuthContext`
  - Keycloak integration is managed centrally; do not create separate auth instances

## 14. Known Limitations / TODOs
- Some TypeScript lints are relaxed; consider adding `@types/node` and stricter TS config if desired
- Checkout has payment form UI but no backend payment integration yet
- README mentions Redux; current cart uses Context/Reducer (no Redux store configured)
- Missing automated tests
- Keycloak integration works but could benefit from token refresh optimization
- **RESOLVED**: Layout height issues with single-component pages (fixed with flexbox CSS)
- **RESOLVED**: Color scheme inconsistency (standardized to GOG purple theme)
- **RESOLVED**: Search functionality was non-functional (now fully implemented with URL routing)

## 15. Key Files Index
- `ui.frontend/src/index.js` – SPA bootstrap, Router, Providers
- `ui.frontend/src/App.js` – AEM page wrapper
- `ui.frontend/src/index.css` – Global CSS with flexbox layout and GOG color variables
- `ui.frontend/src/state/AuthContext.tsx` – Keycloak authentication
- `ui.frontend/src/state/CartContext.ts` – Shopping cart state
- `ui.frontend/src/components/Navigation/Navigation.tsx` – Header + MiniCart + UserProfile + Search
- `ui.frontend/src/components/SearchFilter/SearchFilter.tsx` – Search page with URL integration
- `ui.frontend/src/components/UserProfile/UserProfile.tsx` – User dropdown menu
- `ui.frontend/src/components/Cart/MiniCart.tsx` – Mini-cart UI and checkout trigger
- `ui.frontend/src/components/Checkout/Checkout.tsx` – Checkout page orchestrator
- `ui.frontend/src/components/Checkout/OrderSummary/` – Order summary component
- `ui.frontend/src/components/Checkout/PaymentForm/` – Payment form component
- `ui.frontend/src/components/LoginPrompt/LoginPrompt.tsx` – AEM login component with redirect
- `ui.frontend/src/components/Footer/Footer.tsx` – Footer component with proper layout
- `ui.frontend/src/constants/constants.ts` – AEM host/paths

## 16. Acceptance Heuristics for Agents
- The app renders AEM-driven pages under `/`, and functional `/checkout` and `/login`
- `/search.html` page works with URL parameters and auto-search
- Cart operations persist and compute `total` correctly
- User authentication works via Keycloak
- Authenticated users see UserProfile in header with dropdown menu
- LoginPrompt component respects AEM-configured redirect settings
- Navigation search bar redirects to search page with proper URL encoding
- Search results display correctly with filters and pagination
- Form validation works in checkout with proper formatting
- All pages maintain proper height and layout (no vh/vw units)
- Color scheme is consistent across all components (GOG purple theme)
