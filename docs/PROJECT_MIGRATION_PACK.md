# PROJECT MIGRATION PACK

## 1. Project Description
- Nume proiect: `barbershop-site`
- Scop: site de prezentare barbershop cu servicii dinamice, formular contact si mini-admin.
- Capabilitati principale:
  - listare servicii din Firestore
  - pagini de detaliu pentru fiecare serviciu
  - formular contact care salveaza lead-uri in Firestore
  - mini-admin cu autentificare pe parola pentru management servicii si status lead-uri

## 2. Stack
- Framework: Next.js 16 (App Router)
- UI: React 19 + Tailwind CSS v4
- Limbaj: TypeScript
- Backend layer: Next Route Handlers (`src/app/api/*`)
- DB: Firebase Firestore
- Auth admin: cookie HTTP-only semnat (HMAC)
- Deploy: Vercel

## 3. Architecture
- Pattern: monolith Next.js (frontend + API in acelasi proiect)
- Data flow public:
  1. UI public cere date servicii
  2. `src/lib/services.ts` citeste din Firestore (Admin SDK sau REST fallback)
  3. fallback static pe `src/data/site-data.ts` daca Firebase indisponibil
- Data flow contact:
  1. `src/components/contact-form.tsx` -> `POST /api/contact`
  2. `src/lib/contact-messages.ts` scrie in colectia `contactMessages`
- Data flow admin:
  1. login pe `/api/admin/login`
  2. cookie `admin_session`
  3. endpointuri protejate (`/api/admin/services*`, `/api/admin/messages*`)

## 4. Folder Structure
```txt
barbershop-site/
  src/
    app/
      admin/
        admin-client.tsx
        page.tsx
      api/
        admin/
          login/route.ts
          logout/route.ts
          messages/route.ts
          messages/[id]/route.ts
          services/route.ts
          services/[id]/route.ts
        contact/route.ts
      pachete/[slug]/page.tsx
      globals.css
      layout.tsx
      page.tsx
    components/
      contact-form.tsx
      testimonials-slider.tsx
    data/
      site-data.ts
    lib/
      admin-auth.ts
      contact-messages.ts
      firebase-admin.ts
      services.ts
  firebase.json
  firestore.rules
  firestore.indexes.json
  .firebaserc
  .env.example
  README.md
```

## 5. Key Code Files
- Public homepage: `src/app/page.tsx`
- Service details page: `src/app/pachete/[slug]/page.tsx`
- Contact form component: `src/components/contact-form.tsx`
- Admin app shell: `src/app/admin/page.tsx`
- Admin panel logic: `src/app/admin/admin-client.tsx`
- Contact API: `src/app/api/contact/route.ts`
- Admin services APIs:
  - `src/app/api/admin/services/route.ts`
  - `src/app/api/admin/services/[id]/route.ts`
- Admin messages APIs:
  - `src/app/api/admin/messages/route.ts`
  - `src/app/api/admin/messages/[id]/route.ts`
- Auth/session: `src/lib/admin-auth.ts`
- Firebase bootstrap: `src/lib/firebase-admin.ts`
- Services data layer: `src/lib/services.ts`
- Contact messages data layer: `src/lib/contact-messages.ts`

## 6. Required Environment Variables
- `FIREBASE_PROJECT_ID`
- `FIREBASE_WEB_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_APP_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- Optional Admin SDK:
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

## 7. Firestore Collections
- `services`
  - `name`, `slug`, `duration`, `price`, `description`, `longDescription`, `recommendedFor`, `includes[]`
- `contactMessages`
  - `name`, `phone`, `message`, `status` (`new|in_progress|resolved`), `createdAt`, `updatedAt`
