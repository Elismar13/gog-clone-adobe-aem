# GOG Clone - AEM SPA Project

## Project Overview
A GOG.com inspired game store built with Adobe Experience Manager (AEM) as a Single Page Application (SPA) using React.

## Current Implementation

### Content Fragments

#### Game
- Title
- Description
- Price
- Score/Rating
- Discount Value
- Release Date
- Genre (selector)
- Developer
- Image Gallery
- System Requirements
- Tags
- Supported platforms
- Languages

#### Developer
- Name
- Logo
- Description
- Website URL
- Social Media Links

#### Highlight
- Title
- Subtitle
- Description
- Background Image
- Call-to-Action Button
- External Link

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
- Styled Components for styling
- Redux for state management
- React Router for navigation
- Responsive Design

### Backend
- AEM SPA Editor
- Sling Models
- Content Fragments
- Experience Fragments
- Dispatcher Configuration

## Roadmap

### Phase 1: Core Shopping Experience (Current)
- [x] Basic Game Listing
- [x] Game Detail Pages
- [x] Search & Filter Functionality
- [x] Responsive Design
- [ ] Shopping Cart (Basic)
  - Add to Cart
  - Remove from Cart
  - Update Quantity
  - Mini-cart Preview

### Phase 2: User Accounts & Checkout
- [ ] User Authentication
  - Registration
  - Login/Logout
  - Password Recovery
  - Social Login (Google, Facebook)
- [ ] Enhanced Shopping Cart
  - Save for Later
  - Gift Options
  - Promo Codes
- [ ] Checkout Process
  - Shipping Information
  - Payment Methods
  - Order Review
  - Order Confirmation

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
- [ ] Recommendation Engine
  - "You May Also Like"
  - "Recently Viewed"
  - Personalized recommendations

### Phase 4: Advanced Features
- [ ] Multi-language Support
- [ ] Regional Pricing
- [ ] Gift Cards
- [ ] Subscription Service
- [ ] Download Manager
- [ ] Cloud Saves

### Phase 5: Performance & Optimization
- [ ] Lazy Loading
- [ ] Image Optimization
- [ ] Code Splitting
- [ ] Caching Strategy
- [ ] SEO Optimization

## Technical Debt & Improvements
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] Performance Audits
- [ ] Accessibility Improvements

## Future Considerations
- Mobile App Development
- Desktop Client Integration
- VR/AR Game Previews
- Community Features
- Developer Portal

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

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License
This project is licensed under the Apache 2.0 License - see the LICENSE file for details.
