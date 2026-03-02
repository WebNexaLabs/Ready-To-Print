# Ready To Print

Ready To Print is a React + Vite app for preparing printable photos.

## Local development

1. Install dependencies:

	```bash
	npm install
	```

2. Start dev server:

	```bash
	npm run dev
	```

3. Build production bundle:

	```bash
	npm run build
	```

## Deploy on Vercel

This repository now includes `vercel.json` with:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- SPA rewrite rule to `index.html`

### Option 1: Vercel dashboard

1. Push this repo to GitHub.
2. In Vercel, click **Add New Project** and import the repo.
3. Framework preset: **Vite** (or leave auto-detected).
4. Keep default build settings (already defined in `vercel.json`).
5. Deploy.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## License

This project is proprietary and not open source.

See [LICENSE](LICENSE) for full terms.
