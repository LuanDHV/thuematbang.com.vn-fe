# thuematbang.com.vn FE

Frontend for the thuematbang.com.vn real-estate platform.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn primitives
- `react-hook-form` + `zod`
- `zustand`
- `@tanstack/react-query`

## Key Conventions

- Primary font: `Be Vietnam Pro`
- Shared enum contracts live in `src/constants/enum-values.ts`
- UI label/options live in `src/constants/enum-options.ts`
- CMS forms use `react-hook-form` + `zod`
- CMS mutations go through server actions
- Toasts use `sonner`

## Run

```bash
npm install
npm run dev
```

## Notes

- Public, auth, CMS admin, and CMS user flows are separated by route groups.
- Listing forms are split into shared field components so create/edit flows can reuse the same base logic.
- Hero banners are loaded from the API and rendered as a slider on the homepage.

