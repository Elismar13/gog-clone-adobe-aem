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


## 3. Content Model (AEM Content Fragments)
Defined in README and used by components/pages:
- Jogo: `title`, `description`, `price`, `score`, `discountValue`, `releaseDate`, `genre`, `developer`, `imageList`
- Desenvolvedor: `title`, `image`
- Destaque: `title`, `externalLink`, `image`

## 4. Frontend Modules and Responsibilities
- `src/index.js`
  - Initializes AEM `ModelManager` and Browser History
  - Mounts `CartProvider`
  - Declares routes:
    - `GET /checkout` → `pages/Checkout`
    - `GET /` (fallback) → AEM-controlled SPA (`App`)
  - Can host additional global utilities (e.g., telemetry) if needed
- `src/App.js`
  - AEM page container rendering `childComponents` and `childPages`
- `src/components/Navigation/Navigation.tsx`
  - Header/nav and embeds `MiniCart`
- `src/components/Cart/MiniCart.tsx`
  - Mini-cart dropdown: list items, edit quantities, remove, clear
  - Button “Finalizar compra”
    - Navega para `/checkout`
- `src/pages/Checkout.tsx`
  - Displays cart summary, allows editing quantities/removal, shows total
- `src/state/CartContext.ts`
  - `CartProvider` with reducer/persistence
  - Public API via hook `useCart()`:
    - `addItem`, `removeItem`, `updateQuantity`, `clear`, `total`, `items`
- `src/constants/constants.ts`
  - AEM host and page paths used by navigation/links

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
- `/checkout`
- `/` fallback → AEM SPA (pages handled by AEM SPA editor)


## 9. Build, Run, Deploy
- Frontend: CRA scripts in `ui.frontend/package.json`
  - `start` (dev), `build` (build + clientlib generator), `sync` (aemsync)
- AEM: Maven build at repo root → deploy UI apps/content packages into AEM 6.5+
- Dispatcher: Not detailed here; assumed standard AEM dispatcher setup

## 10. Coding Conventions and Constraints
- React 16 + TypeScript files in some modules (TS lint errors may appear in IDE; runtime is JS-compatible)
- Do not break AEM SPA Editor contract in `App.js`/`ModelManager` usage
- Use `CartContext` for shopping cart state; do not create parallel state stores
- React Router v5 API only (no hooks like `useNavigate` from v6)

## 11. Security Considerations
- Validate/sanitize any user-generated content rendered in components
- Avoid storing sensitive credentials in the client; rely on AEM/dispatcher for protection of server endpoints
- Follow AEM dispatcher best practices for caching and access control

## 12. Extension Guidelines for AI Agents
- Adding a new page/route:
  1) Create component under `src/pages/YourPage.tsx`
  2) Add `<Route path="/your-page">` in `index.js`
  3) From UI, navigate with `history.push('/your-page')`
- Integrating a new AEM component:
  1) Implement React component under `src/components/...`
  2) Map it in `./components/import-components`
  3) Ensure Sling Model/Content Fragment delivers required fields
- Modifying the cart:
  - Use `useCart()` API and keep reducer pure; storage key is `cart`

- ## 13. Known Limitations / TODOs
- Some TypeScript lints are relaxed; consider adding `@types/node` and stricter TS config if desired
- Checkout is a basic page (no payment/shipping integration yet)
- README mentions Redux; current cart uses Context/Reducer (no Redux store configured)
- Missing automated tests

## 14. Key Files Index
- `ui.frontend/src/index.js` – SPA bootstrap, Router, Providers
- `ui.frontend/src/App.js` – AEM page wrapper
- `ui.frontend/src/components/Navigation/Navigation.tsx` – Header + MiniCart
- `ui.frontend/src/components/Cart/MiniCart.tsx` – Mini-cart UI and checkout trigger
- `ui.frontend/src/pages/Checkout.tsx` – Checkout page
- `ui.frontend/src/state/CartContext.ts` – Cart state
- `ui.frontend/src/constants/constants.ts` – AEM host/paths

## 15. Acceptance Heuristics for Agents
- The app renders AEM-driven pages under `/`, and a functional `/checkout`
- Cart operations persist and compute `total` correctly
