# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Environment & Cloudinary

Copy `.env.example` to `.env` at the project root and fill in values. Example vars required:

- `VITE_CLOUDINARY_CLOUD_NAME` (public cloud name)
- `VITE_CLOUDINARY_UPLOAD_PRESET` (unsigned preset name)
- `VITE_FIREBASE_*` (your Firebase configuration values)

Notes: Do NOT commit `.env` with real values. The Cloudinary unsigned preset is safe to use in the browser. Do NOT include your Cloudinary API secret in the frontend.

## Tailwind CSS

Tailwind CSS is configured. To run locally:

1. npm install
2. npm run dev

The app uses the following brand colors in Tailwind config:
- Primary Accent: `#C5A059` (class `bg-kob-primary` / `text-kob-primary`)
- Dark Text/Background: `#2D1E17` (class `text-kob-dark`)
- Secondary Gold: `#D4AF37` (class `text-kob-gold`)

## Cloudinary uploads

Marketplace allows image upload; images are uploaded to Cloudinary and the returned `imageURL` is stored in Firestore under the product document.

## Deployment

This project can be built with `npm run build`. For GitHub Pages: build the project and publish the `dist/` folder to `gh-pages` branch or use a static hosting provider.
