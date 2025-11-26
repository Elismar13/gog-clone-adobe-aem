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

1. **Banner**
   - Title
   - Subtitle
   - Background Image
   - Call-to-Action Button
   - Price Information
   - Discount Badge

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

## Technical Implementation

### Frontend
- Built with React
- Bootstrap and CSS for styling
- Redux for state management
- Responsive Design

### Backend
- AEM SPA Editor
- Sling Models
- Content Fragments
- Experience Fragments

## Roadmap

### Phase 1: Core Shopping Experience (Current)
- [x] Basic Game Listing
- [x] Game Detail Pages
- [x] Search & Filter Functionality
- [x] Responsive Design
- [x] Shopping Cart (Basic)
- [x] Add to Cart
- [x] Remove from Cart
- [x] Update Quantity
- [x] Mini-cart Preview

### Phase 2: User Accounts & Checkout
- [ ] User Authentication - KeyCloack
  - Registration
  - Login/Logout
  - Password Recovery

### Phase 3: Enhanced Features
- [ ] User Dashboard
  - Order History
  - Wishlist
  - Payment Methods
  - Account Settings
- [ ] Reviews & Ratings
  - User Reviews
  - Star Ratings
  - helpful Votes

### Phase 4: Advanced Features
- [ ] Multi-language Support
- [ ] Regional Pricing

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

