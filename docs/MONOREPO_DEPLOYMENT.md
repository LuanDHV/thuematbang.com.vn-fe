# Monorepo Deployment

The monorepo is deployed as two Coolify resources from the same Git repository.

## Client Resource

- App path: `apps/client`
- Domain: `https://thuematbang.com.vn`
- Runtime: Next.js SSR
- Build command from repository root:

```bash
npm install
npm run build:client
```

- Start command from repository root:

```bash
npm run start:client
```

## Admin Resource

- App path: `apps/admin`
- Domain: `https://admin.thuematbang.com.vn`
- Runtime: static Vite SPA
- Build command from repository root:

```bash
npm install
npm run build:admin
```

- Static output:

```txt
apps/admin/dist
```

The admin host must rewrite non-asset routes to `index.html`.

```nginx
try_files $uri $uri/ /index.html;
```

## Contracts

- App path: `packages/contracts`
- Runtime: none
- Deployment: none
- Build role: `npm run build:contracts` runs before either app build.

Internal monorepo consumers use `@thuematbang/contracts` through the workspace,
so no GitHub Package token is required for normal client/admin deployment.
