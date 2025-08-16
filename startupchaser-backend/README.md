# StartupChaser Backend (Firebase Functions)

## Quick start

- Prereqs: Node 20, Firebase CLI (`npm i -g firebase-tools`), configured default project in `.firebaserc`.

```
cd functions
npm i
npm run build
firebase emulators:start --only functions,firestore,auth,storage
```

Deployed function: `asia-south1` region, exported as `api`.

- Local emulator URL: `http://127.0.0.1:5001/<project-id>/asia-south1/api`
- Health check: `GET /health`

## Auth endpoints

- POST `/auth/signup`
  - body: `{ name, email, password, profile_type: "student"|"startup", skills?: string[], bio?: string }`
  - creates Firebase Auth user + Firestore `users/{uid}` profile
  - response: `{ uid, customToken }` (use client SDK to `signInWithCustomToken` then obtain ID token)

- POST `/auth/signin`
  - body: `{ email, password, idToken }`
  - You must sign in on client with Firebase Web SDK to obtain `idToken` (e.g., `signInWithEmailAndPassword`), then call this endpoint to set a `__session` cookie.
  - response: `{ uid }`

- POST `/auth/signout`
  - clears `__session` cookie

- GET `/auth/me`
  - requires valid bearer token or `__session` cookie
  - response: `{ uid, email, profile_type }`

## Users endpoints

- GET `/users/me` → returns current user profile from Firestore
- PATCH `/users/me` → update own profile fields, server timestamps will be applied

## Firestore rules (dev)

- `users/{userId}` readable/writable by the owner
- All other writes are blocked by client; server uses Admin SDK

Tighten rules as data model expands.