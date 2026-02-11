# GOG Clone - AEM SPA Project

## Project Overview
A GOG.com inspired game store built with Adobe Experience Manager (AEM) as a Single Page Application (SPA) using React.

## Current Implementation

### Content Fragments

#### Jogo
	 - title
	 - description
	 - price
	 - score
	 - discountValue
	 - releaseDate
	 - genre (selector)
	 - developer
	 - imageList

#### Desenvolvedor
	 - title
	 - image

#### Destaque
	- title
	- externalLink
	- image


### Implemented Components

1. **Carousel**
   - Title

2. **Game List**
   - Grid/List View Toggle
   - Filtering Options
   - Sorting Options
   - Pagination
   - Game Cards

3. **Game Detail**
   - Game Title
   - Hero Image
   - Screenshots Gallery
   - Description
   - Price & Purchase Options
   - System Requirements
   - Reviews & Ratings

4. **Search & Filter**
   - Search Bar
   - Genre Filter
   - Price Range
   - Platform Filter
   - Release Date Filter
   - Sort Options

5. **Navigation**
   - Main Menu
   - User Menu
   - Breadcrumbs
   - Footer Navigation

6. **Highlight**
   - Featured Content
   - Promotional Banners
   - New Releases
   - Special Offers

7. **MiniCart**
   - Dropdown with cart items
   - Quantity controls
   - Remove items
   - Checkout button with auth check

8. **UserProfile** (Header Component)
   - User avatar and name from Keycloak
   - Dropdown menu with profile options
   - Quick stats (cart items, favorites, orders)
   - Logout functionality
   - Bootstrap styling

9. **LoginPrompt** (AEM Component)
   - Keycloak integration
   - Configurable post-login redirect
   - Visual countdown with progress bar
   - Configurable via AEM dialog:
     - `postLoginDestination`: Página de destino
     - `redirectionTimeout`: Tempo de redirecionamento (segundos)
     - `shouldRedirect`: Ativar/desativar redirecionamento
     - `showLogout`: Exibir botão de logout

10. **Checkout** (Modular)
    - OrderSummary: Resumo do pedido com desconto de 10%
    - PaymentForm: Formulário de pagamento (Cartão/PIX)
    - AuthRequired: Tela para usuários não autenticados
    - EmptyCart: Tela para carrinho vazio
    - Integração com CartContext e AuthContext
    - Advanced form validation and real-time formatting:
      - CPF: `123.456.789-11` automatic formatting
      - Credit card: `1234 5678 9012 3456` spacing
      - Expiry: `MM/AA` format
      - CEP: `12345-678` formatting
      - Phone: `(11) 11111-1111` automatic formatting
      - Email auto-lowercase and state uppercase conversion
    - Comprehensive validation with detailed error messages

11. **SearchFilter** (Search Page)
    - URL parameter support (`?q=term`)
    - Automatic search execution from Navigation
    - Integration with existing filters and GraphQL API
    - Game filtering with sidebar (genre, developer, score, discount)
    - Grid display of search results with Gameitem components

12. **Footer** (Layout Component)
    - Proper footer layout with flexbox
    - AEM SPA Editor compatible (no vh/vw units)
    - Consistent dark theme styling

## Technical Implementation

### Frontend
- Built with React + TypeScript
- Bootstrap 5 and CSS for styling
- Context API for state management (Cart, Auth)
- Responsive Design
- Keycloak integration for authentication
- GOG purple color scheme with CSS variables
- Advanced form validation and formatting
- Functional search with URL routing
- AEM SPA Editor compatible layout (flexbox, no vh/vw)

### Backend
- AEM SPA Editor
- Sling Models with exporter framework
- Content Fragments
- Experience Fragments
- Keycloak authentication server

## Roadmap

### Phase 1: Core Shopping Experience ✅ COMPLETED
- [x] Basic Game Listing
- [x] Game Detail Pages
- [x] Search & Filter Functionality
- [x] Responsive Design
- [x] Shopping Cart (Full)
- [x] Add to Cart
- [x] Remove from Cart
- [x] Update Quantity
- [x] Mini-cart Preview
- [x] Checkout Page with Payment Forms

### Phase 2: User Accounts & Authentication ✅ COMPLETED
- [x] User Authentication - Keycloak
  - Login/Logout
  - JWT Token Integration
  - User Profile Component
- [x] Protected Routes
- [x] Login Prompt Component with configurable redirect
- [x] Header with conditional login button

### Phase 3: Enhanced Features ✅ COMPLETED
- [x] **Functional Search System**
  - Navigation search bar with URL redirect
  - Search page with automatic parameter reading
  - Integration with existing filters
- [x] **Advanced Form Validation**
  - Real-time formatting (CPF, cartão, CEP, telefone)
  - Comprehensive validation with error messages
  - Professional UX patterns
- [x] **UI/UX Improvements**
  - Standardized GOG purple color scheme
  - Fixed layout height issues (AEM compatible)
  - Improved visual consistency

### Phase 4: User Dashboard (In Progress)
- [ ] User Dashboard
  - Order History
  - Wishlist
  - Payment Methods
  - Account Settings
- [ ] Reviews & Ratings
  - User Reviews
  - Star Ratings
  - Helpful Votes
- [ ] Backend payment integration

### Phase 5: Infrastructure & Optimization
- [ ] Migrar para o cloud
- [ ] Testes unitários (JUnit)
- [ ] Estratégias de Busca dinâmica
- [ ] Multi-language Support
- [ ] Regional Pricing
- [ ] E2E Tests

## Recent Improvements

### ✅ Completed Features

1. **Search System**
   - Navigation search bar now functional
   - URL-based search with parameter passing
   - Automatic search execution on page load
   - Integration with existing filter system

2. **Form Validation & UX**
   - Real-time input formatting (CPF, cartão, CEP, telefone)
   - Comprehensive validation with detailed error messages
   - Professional form handling patterns
   - Improved accessibility and usability

3. **Visual Consistency**
   - Standardized GOG purple color scheme across all components
   - CSS variables for consistent theming
   - Fixed layout height issues for single-component pages
   - AEM SPA Editor compatible (no vh/vw units)

4. **Layout Improvements**
   - Flexbox-based layout for proper height management
   - Footer component with proper positioning
   - Responsive design maintenance
   - Cross-browser compatibility

## Technical Debt & Improvements
- [ ] Unit Tests
- [ ] E2E Tests

## Getting Started

### Prerequisites
- Java 11+
- Maven 3.6.3+
- Node.js 14+
- AEM 6.5+

### Installation
1. Clone the repository
2. Run `mvn clean install`
3. Deploy to AEM
4. Install the UI package
5. Start the development server

