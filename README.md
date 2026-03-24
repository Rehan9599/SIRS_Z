# SIRS_Z Frontend

This repository currently documents the frontend application only.

## Tech Stack

- React
- Vite

## Frontend Location

The frontend code lives in the `Client` folder.

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

## Run Frontend Locally

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
```

## Notes

- This README is intentionally frontend-only for now.

