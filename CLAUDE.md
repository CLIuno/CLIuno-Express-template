# CLIuno Express template

Express 5 + TypeScript + TypeORM (better-sqlite3) REST API serving the CLIuno contract:
JWT auth (verify-email gated login, refresh, reset, OTP), users, todos, posts+comments,
follows, roles — under `/api/v1`.

## Commands

```bash
pnpm dev         # nodemon + tsx src/app.ts (needs API_VERSION=v1, JWT_SECRET_KEY, REFRESH_JWT_SECRET_KEY)
pnpm build       # tsup
pnpm lint        # oxlint
pnpm type-check  # tsc --noEmit --skipLibCheck
pnpm format      # oxfmt src/  (script name: fmt if present)
```

Copy `.env.example` → `.env`. SQLite `db.sqlite` is created automatically
(TypeORM `synchronize: true` — entity changes apply on boot; delete the file for a reset).

## Structure

`src/routers/v1/` (routes) → `src/controllers/` → `src/entities/` (TypeORM).
`src/middlewares/` has `ensureAuthenticated` (Bearer JWT → `req.user`) and
`RoleMiddleware.admin` (checks `user.role.name === 'admin'`).

## Contract rules this codebase follows

- Responses: `{status, message, data}`; frontends destructure exact keys
  (`data.users`, `data.user`, `data.todos`, `data.todo`, `data.posts`, `data.post`,
  `data.followers`, `data.following`, `data.isFollowing`, login `data.token`).
- Request keys: camelCase (`usernameOrEmail`, `refreshToken`, `oldPassword`/`newPassword`, `otp`).
- One-time tokens live **on the user row** (`reset_token`, `verify_token`) so
  reset/verify-email look users up by token; registration stores the verify token it emails.
- The `user` role is created on first registration (fresh clone works with no seeding).
- OTP endpoints act on the authenticated user (otpauth TOTP via `otpauth` lib).
- After sending an error response, **return** — every guard ends with `return`.
- Creates attach the authenticated user as owner (posts, todos).

## Conventions

oxc-only lint/format (`semi: false`, single quotes, 4-space); conventional commits
(commitlint + husky); mail goes to MAIL_HOST/MAIL_PORT (use mailpit or any sink locally).

## AI agents (Claude Code and friends)

- **Check the CLIuno skills first**: `npx cliuno@latest skills status` — if any is
  `missing`/`outdated`, run `npx cliuno@latest skills install` (adds `.claude/skills/cliuno-*`:
  the generator workflow, the scaffold guide, and the shared REST contract).
- **Generate resources, don't hand-write them**:
  `npx cliuno@latest make:resource Product --fields name:string,price:number,inStock:boolean`
  creates `src/entities/product.entity.ts`, `src/controllers/product.controller.ts`, `src/routers/v1/product.router.ts`, `src/validators/product.validator.ts`, `src/__tests__/product.spec.ts` and registers it in `src/routers/index.ts`, following this
  template's conventions and the `{status, message, data}` contract. `--dry-run` previews,
  re-running never duplicates registrations, `--force` overwrites.
- Single pieces: `make:model`, `make:controller`, `make:validator`, `make:test`. `npx cliuno@latest make` lists them.
- Then edit fields/business logic only, and run the gates above.
