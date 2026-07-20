# TypeScript → JavaScript Conversion Progress

## Phase 5: Convert `.tsx` → `.jsx` (app pages)

- [x] `frontend/app/layout.tsx` → `frontend/app/layout.jsx`
- [x] `frontend/app/page.tsx` → `frontend/app/page.jsx`
- [x] `frontend/app/head.tsx` → `frontend/app/head.jsx`
- [x] `frontend/app/loading.tsx` → `frontend/app/loading.jsx`
- [x] `frontend/app/providers.tsx` → `frontend/app/providers.jsx`
- [x] `frontend/app/about/page.tsx` → `frontend/app/about/page.jsx`
- [x] `frontend/app/admin/page.tsx` → `frontend/app/admin/page.jsx`
- [x] `frontend/app/advanced-search/page.tsx` → `frontend/app/advanced-search/page.jsx`
- [x] `frontend/app/archive/[slug]/page.tsx` → `frontend/app/archive/[slug]/page.jsx`
- [x] `frontend/app/collections/page.tsx` → `frontend/app/collections/page.jsx`
- [x] `frontend/app/collections/[slug]/page.tsx` → `frontend/app/collections/[slug]/page.jsx`
- [x] `frontend/app/community/page.tsx` → `frontend/app/community/page.jsx`
- [x] `frontend/app/dashboard/page.tsx` → `frontend/app/dashboard/page.jsx`
- [x] `frontend/app/explore/page.tsx` → `frontend/app/explore/page.jsx`
- [x] `frontend/app/learn/page.tsx` → `frontend/app/learn/page.jsx`
- [x] `frontend/app/login/page.tsx` → `frontend/app/login/page.jsx`
- [x] `frontend/app/sign-up/page.tsx` → `frontend/app/sign-up/page.jsx`
- [x] `frontend/app/support/page.tsx` → `frontend/app/support/page.jsx`

## Phase 6: Update config files

- [x] Update `frontend/next.config.mjs` — remove typescript block
- [x] Update `frontend/package.json` — remove typescript dep, update lint script
- [ ] Update root `package.json` if needed

## Phase 7: Delete old .ts/.tsx files

- [x] Remove all old TypeScript files from disk
- [x] Remove `frontend/types/` directory
- [x] Remove `frontend/tsconfig.json`
- [x] Remove `frontend/next-env.d.ts`

## Phase 8: Verify

- [x] Test with `npm run build` in frontend
