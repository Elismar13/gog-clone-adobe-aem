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

## Technical Implementation

### Frontend
- Built with React + TypeScript
- Bootstrap 5 and CSS for styling
- Context API for state management (Cart, Auth)
- Responsive Design
- Keycloak integration for authentication

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

### Phase 3: Enhanced Features (In Progress)
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

### Phase 4: Infrastructure & Optimization
- [ ] Migrar para o cloud
- [ ] Testes unitários (JUnit)
- [ ] Estratégias de Busca dinâmica
- [ ] Multi-language Support
- [ ] Regional Pricing
- [ ] E2E Tests

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

