# THE VACHAS — Literary Club Portfolio

A backend-free, static React + TypeScript website for THE VACHAS, the literature club associated with K L University, Vijayawada. Public content is managed through typed files in `src/data/`; no login, API, database, or upload dashboard is included.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The static output is written to `dist/`.

## Deploy

- **Netlify:** connect the repository; the included `netlify.toml` sets `npm run build`, the `dist` publish directory, and SPA route fallback.
- **Vercel:** import the repository; the included `vercel.json` rewrites client-side routes to the app entry.
- **GitHub Pages:** build and publish `dist/` using a Pages workflow; configure Vite's `base` to match the repository subpath before deployment if using a project site.

## Editing content

Update typed files in `src/data/` and put approved, optimized media under `public/assets/`, or link publicly accessible hosted assets in the data records. Add blog article links in `src/data/blogs.ts`, publications in `src/data/publications.ts`, and gallery images in `src/data/gallery.ts`. See [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md) for complete add, update, remove, and publishing examples.

## Editor checklist

- Verify and personalize the starter introduction and wing descriptions.
- Add only confirmed team profiles, event details, and achievement records.
- Use approved club images, posters, covers, and authorized PDFs.
- Configure real social/contact and recruitment links; remove unset placeholders only by editing the relevant data.
- Check all content at mobile widths and run the production build before publishing.
"# vachas_26" 
