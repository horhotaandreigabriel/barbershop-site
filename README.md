# Urban Edge Barbershop

Site Next.js pentru prezentare + mini-admin de servicii dinamic prin Firebase Firestore.

## 1. Instalare

```bash
npm install
```

## 2. Configurare `.env.local`

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_WEB_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_APP_ID=1:1234567890:web:abc123
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1234567890

# Optional (recomandat in productie)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

ADMIN_PASSWORD=schimba-ma-cu-o-parola-puternica
ADMIN_SESSION_SECRET=schimba-ma-cu-un-secret-lung-random
```

Configul Web vine din `firebase apps:sdkconfig WEB ...`.
Cheile de Service Account vin din Firebase Console -> Project settings -> Service accounts.

## 3. Ruleaza local

```bash
npm run dev
```

Site public: `http://localhost:3000`  
Mini-admin: `http://localhost:3000/admin`

## 4. Colectia Firestore

- Creeaza colectia `services`.
- Documentele contin campurile:
  - `name` (string)
  - `slug` (string)
  - `duration` (string)
  - `price` (string)
  - `description` (string)
  - `longDescription` (string)
  - `recommendedFor` (string)
  - `includes` (array de string)

Mini-admin-ul poate crea aceste documente direct, deci poti porni si cu colectie goala.

- Formularul de contact salveaza in colectia `contactMessages` cu campurile:
  - `name` (string)
  - `phone` (string)
  - `message` (string)
  - `status` (`new` | `in_progress` | `resolved`)
  - `createdAt` (ISO string)
  - `updatedAt` (ISO string)

## Note

- Daca Firebase nu e configurat, site-ul public cade automat pe datele statice din `src/data/site-data.ts`.
- Daca exista `FIREBASE_PROJECT_ID` + `FIREBASE_WEB_API_KEY`, site-ul foloseste Firestore direct (REST fallback), chiar fara Service Account.
- Autentificarea din `/admin` este simpla (parola din env + cookie HTTP-only semnat).
