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
