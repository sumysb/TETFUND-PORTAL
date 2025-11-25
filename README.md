## Access-Level Portal

The portal exposes three dedicated flows:

- **Admin** – manage accounts and audit file traffic.
- **Department** – send and receive documents (departmental ID + staff ID).
- **School** – upload requests or report incidents via school code only (no password).

The UI lives in the Next.js App Router, while `/api/auth` performs credential checks against PostgreSQL.

## Getting Started

```bash
npm install
cp env.local.example.txt .env.local   # update DATABASE_URL inside
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Database Setup (PostgreSQL)

`src/app/api/auth/route.ts` expects the following tables/columns:

```sql
CREATE TABLE admins (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_plain text NOT NULL, -- replace with hashed storage in production
  display_name text,
  scope text[] DEFAULT ARRAY[]::text[]
);

CREATE TABLE departments (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  department_code text NOT NULL,
  inbox text
);

CREATE TABLE department_staff (
  id serial PRIMARY KEY,
  department_id integer REFERENCES departments (id) ON DELETE CASCADE,
  staff_code text NOT NULL,
  UNIQUE (department_id, staff_code)
);

CREATE TABLE schools (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  school_code text NOT NULL,
  display_name text,
  district text
);
```

Seed example data:

```sql
INSERT INTO admins (username, password_plain, display_name, scope)
VALUES
  ('sys.supervisor', 'Admin#2025!', 'System Supervisor', ARRAY['users.manage','files.audit','config.write']),
  ('compliance.lead', 'AuditTrail#1', 'Compliance Lead', ARRAY['files.audit']);

INSERT INTO departments (key, name, department_code, inbox)
VALUES
  ('hr', 'Human Resources', 'DPT-2458', 'hr.docs@intranet'),
  ('ict', 'ICT', 'DPT-5500', 'ict.bridge@intranet');

INSERT INTO department_staff (department_id, staff_code)
VALUES
  ((SELECT id FROM departments WHERE key = 'hr'), 'HR-7788'),
  ((SELECT id FROM departments WHERE key = 'ict'), 'ICT-9911');

INSERT INTO schools (username, school_code, display_name, district)
VALUES
  ('riverdale.primary', 'SCH-00532', 'Riverdale Primary', 'Central'),
  ('cedar.valley', 'SCH-01420', 'Cedar Valley High', 'North');
```

## Environment Variables

Create `.env.local` (see `env.local.example.txt`):

```
DATABASE_URL=postgres://user:password@localhost:5432/access_portal
```

Use SSL parameters inside the URL when deploying to managed Postgres.

## Usage

1. Run `npm run dev`.
2. Select Admin, Department, or School from the left column.
3. Enter credentials backed by your Postgres database.
4. Successful submissions receive a confirmation banner; failures show an error message returned by `/api/auth`.

## Deployment

`DATABASE_URL` must be available in the runtime environment (Vercel, Render, Fly.io, etc.). After setting secrets, deploy with the standard Next.js workflow (`npm run build && npm run start` or the platform equivalent). Optional next steps include adding session storage, redirect logic, and CRUD screens per role.
