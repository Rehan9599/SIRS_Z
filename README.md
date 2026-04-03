# ReadyCool (SIRS_Z)

ReadyCool is a privacy-first platform for commercial refrigeration.
It helps commercial buyers and sellers move pre-owned cooling equipment through a streamlined flow, while also supporting service, AMC, and tender-style work via a single “commercial desk” experience.

## USP (Unique Selling Proposition)

**Privacy-first marketplace + routed commercial support for cooling equipment.**

What that means in practice: buyers shop listings without seeing the original seller identity, and the same platform experience is built to route users to service/procurement/resale paths for commercial refrigeration needs.

## What’s included in this repo (current MVP)

1. **Auth & account**
   - Signup/login
   - Profile view/edit
2. **Resale marketplace**
   - “Sell” flow: create a listing with category, brand/model, city, price, condition, and optional image upload
   - “Buy” flow: browse listings with search
3. **Commercial desk (front-end messaging)**
   - The `Commercial` page describes tenders/AMC/service handling and the intended workflow, but the backend “create service request / tender bid” intake isn’t implemented as API endpoints yet.
4. **Dashboard (UI expects additional data)**
   - The dashboard UI is implemented and expects `service_requests` and `purchases` payloads, but the backend endpoints to create those records are not wired up yet.

## Important privacy + trust notes

The UI is designed to hide seller identity, but **API-level privacy should be hardened** before production launch (e.g., avoid returning seller identifiers in responses, and implement an inquiry messaging layer).

Also review password storage: the backend currently needs verification that passwords are stored securely (bcrypt hashing is present but the current user-creation path should be confirmed end-to-end).

## How to run locally

### Prerequisites

- Node.js 18+
- npm
- MySQL (the backend uses `mysql2`)

### Backend (Express + MySQL)

1. Open `Server/`
2. Copy environment variables:
   - `Server/.env.example` -> `Server/.env`
3. Install and start:
   ```bash
   cd Server
   npm install
   npm run dev
   ```

The server runs schema creation by executing `Server/queries.sql` on startup.

### Frontend (React + Vite)

1. Open `Client/`
2. Install and start:
   ```bash
   cd Client
   npm install
   npm run dev
   ```

By default the frontend calls the API at `http://localhost:5000` (see `Client/src/api.js`).
To point it to another backend, set `VITE_API_URL`.

## Folder structure (high level)

```text
Client/  -> React + Vite frontend
Server/  -> Express API + MySQL + uploads + SQL schema
```

## Recommended next improvements

- Implement the commercial desk intake (service request + tender-style requests/quotes) with matching API endpoints.
- Add a real listing verification workflow (status transitions + moderation) so “Verified inventory” is not just a UI label.
- Implement privacy-by-design at the API layer (never return seller identifiers; use an inquiry layer for buyer/seller communication).
- Add listing detail pages and an actual “Inquire” / next-step flow.
- Secure auth properly (confirm bcrypt usage on signup and ensure consistent verification on login).

