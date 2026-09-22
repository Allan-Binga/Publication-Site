# Skirill — Publication Site

A publication platform with a public reading site, an author dashboard, and an Express API backed by PostgreSQL. Authors can register, manage their profiles, write articles with a rich-text editor, and publish or save drafts. Readers can browse and search published articles.

## Stack

- **API:** Node.js, Express 5, PostgreSQL through `pg`, JWT authentication, and Jest.
- **Frontends:** React 19, Vite, Tailwind CSS, and TinyMCE in the author dashboard.
- **Services:** Amazon S3 for image uploads, Brevo for password-reset emails, and a Prometheus metrics endpoint.

## Project structure

```text
admin/          Author dashboard
client/         Public reading site
config/         Database pool and in-memory cache
controllers/    API handlers and metrics
middleware/     Authentication, uploads, and rate limiting
routes/         API routes
test/unit/      Backend unit tests
schema.sql      Initial PostgreSQL schema (no application data)
index.js        Express entry point
.github/workflows/actions.yml   Test and VPS deployment workflow
```

## Prerequisites

- Node.js 24 and npm, matching the deployment workflow.
- PostgreSQL and its command-line tools (`psql` and `createdb`). Use PostgreSQL 18 with an up-to-date version 18 client to match the supplied dump, which was exported using PostgreSQL 18.6.
- The PostgreSQL `uuid-ossp` extension must be available on the server.
- An S3 bucket and AWS credentials for working image uploads.
- A Brevo API key and verified sender for working password-reset emails.

The commands below assume a Bash-compatible terminal and are run from the repository root unless stated otherwise.

## Local setup

### 1. Install dependencies

```bash
git clone https://github.com/Allan-Binga/Publication-Site.git
cd Publication-Site
npm ci --legacy-peer-deps
npm --prefix client ci --legacy-peer-deps
npm --prefix admin ci --legacy-peer-deps
```

The dashboard's install script copies TinyMCE into `admin/public/tinymce` automatically.

### 2. Create and initialize your database

For an independent installation, create your own empty database and import [schema.sql](schema.sql) once. There are no seeded accounts or articles.

The supplied dump explicitly assigns object ownership to `postgres`. The following commands use that role on a local development server; enter its password when prompted:

```bash
createdb -h localhost -p 5432 -U postgres publication_db
psql -X -h localhost -p 5432 -U postgres -d publication_db --set=ON_ERROR_STOP=1 --single-transaction --file=schema.sql
```

On Linux installations using peer authentication, the equivalent commands are:

```bash
sudo -u postgres createdb publication_db
sudo -u postgres psql -X -d publication_db --set=ON_ERROR_STOP=1 --single-transaction < schema.sql
```

Choose one method. The API connects over TCP, so its configured database role also needs working password authentication. For local development with the `postgres` role, you can set a password interactively with `\password postgres` inside an administrative `psql` session, then use it in `DB_PASSWORD` below.

For a managed database or a dedicated application role, adapt the dump's `OWNER TO postgres` statements to your database's ownership model before importing. The importing role must be able to create the extension and schema objects. Use a dedicated application role with appropriate permissions in production.

Verify the imported tables:

```bash
psql -h localhost -p 5432 -U postgres -d publication_db -c '\dt public.*'
```

Expected tables:

| Table | Purpose |
| --- | --- |
| `users` | Accounts, password hashes, and refresh tokens |
| `profiles` | Author profiles, with one profile per user |
| `articles` | Article content, slugs, authors, and publication status |
| `password_reset_tokens` | Hashed reset tokens, expiry, and usage state |

The schema includes UUID defaults, unique constraints, foreign keys, indexes, and automatic `updated_at` triggers for articles and profiles. Deleting a user cascades to their articles, profile, and password-reset tokens.

**Import this file only into an empty database.** It is an initial schema snapshot, not a repeatable upgrade script. Do not rerun it against an existing installation.

### 3. Configure the API

Create `.env` in the repository root with your own values:

```dotenv
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=replace-with-your-local-database-password
DB_DATABASE=publication_db

JWT_SECRET=replace-with-a-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-random-secret

AWS_ACCESS_KEY_ID=replace-with-your-access-key
AWS_SECRET_ACCESS_KEY=replace-with-your-secret-key
AWS_REGION=replace-with-your-bucket-region
AWS_S3_BUCKET=replace-with-your-bucket-name

BREVO_API_KEY=replace-with-your-brevo-api-key
CLIENT_URL=http://localhost:5173
```

Generate each JWT secret separately, for example:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

`CLIENT_URL` points to the **author dashboard**, where `/password/change` is implemented. The email sender is currently hardcoded as `info@skirill.org` in [controllers/emailService.js](controllers/emailService.js); replace it with your verified Brevo sender for your installation.

The upload middleware is initialized at startup and requires a nonempty `AWS_S3_BUCKET`. Successful uploads require valid AWS configuration and permission to upload objects. Uploaded image URLs must also be readable by the browsers displaying them. There is no local file-storage fallback.

Keep secrets in the backend environment. Never put AWS credentials, JWT secrets, database credentials, or Brevo keys in frontend `VITE_*` variables.

### 4. Configure both frontends

Create `client/.env` and `admin/.env`, each containing:

```dotenv
VITE_BACKEND_ENDPOINT=http://localhost:3000/publication-site/v1
```

Include `/publication-site/v1` and omit a trailing slash. Restart Vite after changing these values; production builds embed them at build time.

### 5. Start the applications

Run each command in a separate terminal from the repository root:

```bash
# API: http://localhost:3000
npm run dev
```

```bash
# Public reading site: http://localhost:5174
npm --prefix client run dev -- --port 5174 --strictPort
```

```bash
# Author dashboard: http://localhost:5173
npm --prefix admin run dev -- --port 5173 --strictPort
```

The API's CORS allowlist includes these two localhost origins. If you change a frontend's hostname or port, update the allowlist in [index.js](index.js).

Open `http://localhost:5173/register` to create an account, then sign in. Registration creates the associated profile. Create an article in the dashboard and choose `published` to make it available on the public site; a new database initially has no articles to display.

## Database changes and migrations

The repository currently uses **manual initialization through `schema.sql`**. It has no migration runner, migration history table, or `db:migrate` npm script. Starting the API and running the deployment workflow do not create or update tables.

Fresh installations use the schema import above. Existing installations need incremental schema changes that preserve their data. When introducing schema changes, commit and document the corresponding upgrade SQL, test it against a disposable database, and back up the target database before applying it.

For future automated upgrades, the proposed approach is `node-pg-migrate` with versioned migrations. Adopting it will require an initial migration matching this schema and a verified baseline procedure for existing databases. This migration system is not implemented yet.

## Tests and checks

```bash
npm test
npm run test:coverage
npm --prefix client run lint
npm --prefix admin run lint
```

Backend unit tests mock database queries and external services; they do not need a running PostgreSQL server and do not validate the schema import. Validate database setup separately using a disposable database.

Build both frontends with:

```bash
npm --prefix client run build
npm --prefix admin run build
```

Build output is written to `client/dist` and `admin/dist`.

## API overview

All application routes start with `/publication-site/v1`.

| Prefix | Purpose |
| --- | --- |
| `/auth` | Registration, login, logout, token refresh, and password reset |
| `/article` | Public article queries and authenticated author operations |
| `/profile` | Authenticated profile retrieval and editing |
| `/metrics` | Prometheus metrics |

Public API and metrics checks:

```bash
curl http://localhost:3000/publication-site/v1/article/articles
curl http://localhost:3000/publication-site/v1/metrics
```

See [routes/](routes/) for exact methods and paths. The frontends send credentials for authenticated requests. The metrics endpoint currently has no authentication; configure access at your reverse proxy as appropriate for your deployment.

## Production deployment

The backend is prepared for **Render + Neon PostgreSQL**, using `api.skirill.org`. See [DEPLOYMENT.md](DEPLOYMENT.md) for database initialization, Render environment variables, the Blueprint, custom-domain setup, and verification.

The GitHub workflow runs backend checks; Render deploys `master` after CI passes. The former SSH/PM2 deployment to the VPS is removed. Public and admin frontends are managed separately on Vercel and are outside this backend deployment.

## Troubleshooting

- **`relation ... does not exist`:** Confirm that you imported `schema.sql` into the same database selected by the API environment.
- **Schema import fails on `\restrict` or a setting:** Use the PostgreSQL 18 client and server described above. Run the dump through `psql`, which understands its backslash commands.
- **Schema ownership or extension permission errors:** Check the importing role and the dump's explicit `postgres` ownership assignments.
- **CORS rejection:** Use the documented localhost ports or add your exact frontend origin in `index.js`.
- **Frontend requests go to the wrong URL:** Check both frontend environment files and restart or rebuild after changing them.
- **Uploads fail:** Check the bucket name, region, AWS credentials, and object-upload permissions.
- **Password-reset emails fail or open the wrong site:** Check the Brevo key, verified sender, and dashboard `CLIENT_URL`.

## License

The root `package.json` declares the ISC license.
