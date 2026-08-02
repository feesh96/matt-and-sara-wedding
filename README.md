# Sara and Matt's wedding website

The current phase is a static save-the-date website for May 30, 2027 in Princeton, New Jersey.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Iterating on the design

- Edit wedding copy and navigation in `lib/site.ts`.
- Replace assigned images in `public/images` and update `site.media`.
- Change colors and typography roles in `app/theme.css`.
- Change the visual composition in `app/globals.css` without coupling it to wedding data.

The pagoda portrait is intentionally not used in the first draft.

## Verification

```bash
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```
