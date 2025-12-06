# CertManagementFrontend

Angular frontend for Sec CERTIFICATE — upload/manage templates, preview certificate data, request signed PDF generation, and download certificates via the backend API.

Generated with Angular CLI v20.x.

## Quick start (development)
1. Clone and install
```bash
git clone https://github.com/Eve-rine/cert-management-frontend.git
cd cert-management-frontend
npm ci
```

2. Configure API base URL
- Edit `src/environments/environment.ts` (and `environment.prod.ts`) and set:
```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

3. Run locally
```bash
npm start
# or
ng serve --open
```
Open http://localhost:4200

## Key scripts
- Start dev server: `npm start` / `ng serve`
- Build production: `ng build`
- Unit tests: `ng test`

## Expected backend endpoints
The frontend expects a JWT-secured API exposing:
- `POST /auth/login` — return JWT
- `POST /api/templates/upload` — multipart upload (html)
- `GET /api/templates` — list templates for current customer
- `POST /api/certificates/generate` — generate signed PDF (returns id)
- `GET /api/certificates/{id}/pdf` — download signed PDF or return presigned URL

All API calls should include `Authorization: Bearer <token>`.

## Notes
- Designed to work with the companion Spring Boot backend, PostgreSQL, and S3/MinIO (or local storage).
- Keep `apiBaseUrl` consistent between frontend and backend.

