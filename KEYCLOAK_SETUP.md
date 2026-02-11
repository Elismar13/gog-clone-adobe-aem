# Keycloak Setup

## Quick Start

### 1. Start Keycloak with Docker
```bash
docker-compose up -d
```

### 2. Access Keycloak Admin Console
- URL: http://localhost:8080
- Username: admin
- Password: admin_password

### 3. Test Authentication
- Use test user: testuser / test123
- Or register a new user in the GOG Store realm

## Configuration Files
- `docker-compose.yml` - Keycloak + PostgreSQL setup
- `keycloak-config/realm-config.json` - Pre-configured realm
- `.env.local` - Frontend environment variables

## Integration Notes
- Realm: gogstore
- Client ID: gogstore-frontend
- CORS configured for localhost:3000 and localhost:4502

## Reset Services
```bash
docker-compose down -v
docker-compose up -d
```
