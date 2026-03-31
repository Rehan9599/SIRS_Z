# SIRS_Z Project

This repository contains both the frontend and backend applications.

---

## Frontend

**Location:** `Client` folder

**Tech Stack:** React, Vite

### Prerequisites
- Node.js 18+ (recommended)
- npm 9+

### Run Frontend Locally
1. Go to the frontend folder:
	```bash
	cd Client
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Start the development server:
	```bash
	npm run dev
	```
4. Open the local URL shown in terminal (usually `http://localhost:5173`).

---

## Backend

**Location:** `Server` folder

See [Server/README.md](Server/README.md) for backend setup, environment variables, and Aiven/MySQL connection instructions.

## Build Frontend

To create a production build:

```bash
cd Client
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Frontend Structure

```text
Client/
	src/
		App.jsx
		main.jsx
		styles.css
		pages/
			Login.jsx
			Signup.jsx
	index.html

Server/
	index.js
	package.json
	README.md
	# .env (not committed)
```

## Notes

- This README is intentionally frontend-only for now.

