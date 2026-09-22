# Backend deployment: Render + Neon

The Express API runs on Render at `https://api.skirill.org`. Public and admin frontends will be configured separately on Vercel at `https://skirill.org` and `https://admin.skirill.org`. No frontend files are changed by this setup.

## 1. Create PostgreSQL on Neon

Create a Neon project on the Free plan. Choose a region near the Render service region. Create/select an empty database, then run **schema.neon.sql** once in Neon's SQL Editor, targeting that database and branch. It creates the four tables and associated indexes, triggers and constraints in a transaction. It contains no sample data or accounts.

This portable copy removes the local `postgres` ownership assignments and psql-only commands from `schema.sql`. Do not import both files or run it against an existing populated database. If you already have data to preserve, migrate it separately before switching the app.

Use Neon's Connect dialog to obtain the **pooled PostgreSQL connection string** for the same database. Set `sslmode=verify-full` in that URL to validate the server's TLS certificate; retain other supplied parameters. Put this value only into Render's `DATABASE_URL`, not GitHub or the browser frontend.

## 2. Push and create the Render service

Commit these backend changes and push to `master`. The GitHub workflow now runs backend unit tests instead of deploying over SSH to the suspended VPS. It requires no VPS secrets.

In Render, select **New → Blueprint**, connect this GitHub repository, and select `master`. Review `render.yaml`: it creates one **Free Node web service**, no Render database and no frontend services. Set the prompted secret values before creating it. The two JWT secrets are generated independently by Render.

For manual creation via **New → Web Service**, use:

| Setting | Value |
| --- | --- |
| Root directory | Repository root (blank) |
| Branch | `master` |
| Runtime | Node |
| Instance | Free |
| Build command | `npm ci --legacy-peer-deps` |
| Start command | `npm start` |
| Health check | `/health` |
| Auto-deploy | After CI Checks Pass |

Set these environment variables manually if not using the Blueprint:

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `24` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon pooled connection string with TLS |
| `CLIENT_URL` | `https://admin.skirill.org` (password reset destination) |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Two different strong random secrets |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Credentials for the existing S3 upload bucket |
| `AWS_REGION`, `AWS_S3_BUCKET` | Existing bucket region and name |
| `BREVO_API_KEY` | Existing Brevo key for password-reset emails |

Render supplies `PORT` and `RENDER`. The app listens on `0.0.0.0:$PORT`. S3 configuration is needed because upload middleware initializes at startup. Keep the existing S3 bucket available; this deployment does not replace it. Password-reset email uses the existing verified Brevo sender `info@skirill.org`.

## 3. Verify the backend before switching DNS

Wait for successful CI checks and Render deployment. Check Render logs for a successful database connection, then open:

- `https://YOUR-SERVICE.onrender.com/health` — expect `{ "status": "ok" }` (process liveness only).
- `https://YOUR-SERVICE.onrender.com/publication-site/v1/article/articles` — verifies the database-backed public route; an empty initialized database has no articles.

A successful health check alone does not prove the database schema or external services are ready. Verify article queries, then authentication and uploads once the frontends are connected. No schema import runs automatically during deployment.

## 4. Connect api.skirill.org

In Render **Settings → Custom Domains**, verify `api.skirill.org` is attached (the Blueprint declares it). At your DNS provider, replace the old `api` record pointing at the VPS with the CNAME target Render displays. Do not change the root `skirill.org`, `admin`, or `portfolio` records as part of this backend step. Complete domain verification and wait for HTTPS provisioning, then check `https://api.skirill.org/health` and the article route again.

## Frontend handoff for later

For both Vercel projects, set:

```dotenv
VITE_BACKEND_ENDPOINT=https://api.skirill.org/publication-site/v1
```

The API allows credentialed requests from `https://skirill.org`, `https://www.skirill.org`, and `https://admin.skirill.org`. Development also allows localhost ports 5173 and 5174. Existing Secure, HttpOnly, SameSite=Lax authentication cookies work with these HTTPS domains under skirill.org. Test login through `admin.skirill.org` and `api.skirill.org`, not a cross-site combination of vercel.app and onrender.com. API cookie requests already use credentials in the admin frontend.

Free Render services sleep after inactivity and all free services share the monthly instance-hour budget. The health endpoint does not query Neon, allowing the database to scale down between actual requests. Both free-plan quotas still apply.

References: [Render Blueprints](https://render.com/docs/blueprint-spec), [Render custom domains](https://render.com/docs/custom-domains), [Neon connections](https://neon.com/docs/connect/connect-from-any-app).
