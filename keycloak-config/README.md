# Keycloak Docker Setup

## Overview
This directory contains the Docker Compose configuration and Keycloak realm setup for the GOG Store project.

## Files
- `docker-compose.yml` - Docker Compose configuration with Keycloak and PostgreSQL
- `keycloak-config/realm-config.json` - Keycloak realm configuration
- `.env.local` - Environment variables for frontend

## Quick Start

### 1. Start Keycloak
```bash
docker-compose up -d
```

### 2. Access Keycloak Admin Console
- URL: http://localhost:8080
- Username: admin
- Password: admin_password

### 3. Verify Realm Import
The GOG Store realm should be automatically imported with:
- Realm: gogstore
- Test User: testuser / test123
- Frontend Client: gogstore-frontend

## Configuration Details

### Keycloak Server
- **Port**: 8080
- **Admin**: admin / admin_password
- **Database**: PostgreSQL (port 5432)
- **CORS**: Configured for localhost:3000 and localhost:4502

### Test User
- **Username**: testuser
- **Password**: test123
- **Email**: testuser@gogstore.com
- **Role**: user

### Frontend Client
- **Client ID**: gogstore-frontend
- **Public Client**: Yes
- **Redirect URIs**: 
  - http://localhost:3000/*
  - http://localhost:4502/*
  - http://localhost:4502/content/gogstore/us/en/*

## Environment Variables
The `.env.local` file contains the necessary environment variables:
- `REACT_APP_KEYCLOAK_URL=http://localhost:8080`
- `REACT_APP_KEYCLOAK_REALM=gogstore`
- `REACT_APP_KEYCLOAK_CLIENT_ID=gogstore-frontend`

## Troubleshooting

### Reset Keycloak
```bash
docker-compose down -v
docker-compose up -d
```

### Check Logs
```bash
docker-compose logs keycloak
docker-compose logs keycloak-db
```

### Access Database Directly
```bash
docker exec -it keycloak-db psql -U keycloak -d keycloak
```

## Integration with Frontend
1. Ensure `.env.local` is in the project root
2. Start the frontend development server
3. Navigate to any protected route
4. You should be redirected to Keycloak login
5. Use testuser/test123 or create a new user

## Production Considerations
- Change default passwords in production
- Use HTTPS instead of HTTP
- Configure proper email settings for password reset
- Set up proper SSL certificates
- Consider using external database for production
