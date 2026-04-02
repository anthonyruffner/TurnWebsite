# Connecting Turn to Supabase

This guide walks you through connecting your Turn site to Supabase so that **Get Demo** and **Contact** form submissions are saved in a database. No backend server is required—Supabase provides the API and database.

---

## What is Supabase?

Supabase is a backend-as-a-service (like Firebase). For this project we use:

- **Database** – store demo requests and contact messages in PostgreSQL tables.
- **JavaScript client** – your static site sends form data to Supabase with the official `@supabase/supabase-js` library (loaded from a CDN).

Your **anon (public) key** is safe to use in the browser; Supabase uses **Row Level Security (RLS)** so anonymous users can only insert rows, not read or delete them.

---

## Step 1: Create a Supabase account and project

1. Go to [supabase.com](https://supabase.com) and sign up (or log in).
2. Click **New project**.
3. Fill in:
   - **Name** – e.g. `turn` or `turn-demo`.
   - **Database password** – choose a strong password and store it somewhere safe (you need it for direct DB access).
   - **Region** – pick one close to you or your users.
4. Click **Create new project** and wait until the project is ready (usually under a minute).

---

## Step 2: Get your project URL and anon key

1. In the left sidebar, open **Project Settings** (gear icon).
2. Go to the **API** section.
3. You’ll see:
   - **Project URL** – e.g. `https://abcdefghijklmnop.supabase.co`
   - **Project API keys**:
     - **anon public** – use this in your frontend (it’s designed to be public).
     - **service_role** – never use this in the browser; only for server-side or trusted tools.

4. Copy the **Project URL** and the **anon public** key; you’ll paste them into your config in the next step.

---

## Step 3: Configure your site with the URL and anon key

Use a local env file so you never commit secrets.

1. Copy the example env file and add your real values:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edit **`.env.local`** and replace the placeholders:

   ```
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file. **`.env.local`** is gitignored and will not be committed.

4. When you run `npm run dev` or `npm start`, a script reads `.env.local` and generates **`supabase-config.js`** (which is also gitignored). The browser loads that generated file. You never need to edit `supabase-config.js` by hand.

---

## Step 4: Create the database tables and RLS policies

1. In the Supabase dashboard, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open the file **`supabase/schema.sql`** in this repo and copy its full contents.
4. Paste into the SQL Editor and click **Run** (or press Cmd/Ctrl + Enter).

You should see a success message. This script:

- Creates two tables:
  - **`demo_requests`** – from the “Get Demo” form (name, email, phone, company, message).
  - **`contact_messages`** – from the Contact page form (name, email, company, message).
- Enables **Row Level Security** and adds policies so that:
  - **Anonymous users** can only **insert** rows (submit forms).
  - They cannot read, update, or delete rows.

To view submissions: in the dashboard go to **Table Editor**, then open `demo_requests` or `contact_messages`.

---

## Step 5: Test the connection

1. From the project root, run:

   ```bash
   npm run dev
   ```

2. Open the site (e.g. `http://localhost:8000`).
3. Click **Get Demo**, fill out the form, and submit.
4. On the Contact page, submit the contact form as well.
5. In Supabase go to **Table Editor** → **demo_requests** and **contact_messages** and confirm new rows appear.

If something fails, open the browser **Developer Tools** (F12) → **Console** and look for errors (e.g. wrong URL/key or RLS blocking the insert).

---

## What’s in the codebase

| Item | Purpose |
|------|--------|
| **`.env.local.example`** | Template for env vars; copy to `.env.local` and add your Supabase URL and anon key. |
| **`.env.local`** | Your real keys (gitignored). Not used by the browser directly. |
| **`scripts/generate-supabase-config.js`** | Run by `npm run dev` / `npm start`; reads `.env.local` and writes `supabase-config.js`. |
| **`supabase-config.js`** | Generated file (gitignored) that the browser loads. Created from `.env.local` when you run dev. |
| **`supabase-config.example.js`** | Fallback template if you don’t use `.env.local`; copy to `supabase-config.js` and edit by hand. |
| **`supabase/schema.sql`** | SQL to create tables and RLS policies; run once in Supabase SQL Editor. |
| **`index.html`** / **`contact.html`** | Load Supabase JS and `supabase-config.js` before `script.js`. |
| **`script.js`** | Creates the Supabase client (when config is set) and submits the Get Demo and Contact forms to the `demo_requests` and `contact_messages` tables. |

If `.env.local` is missing, the generator still runs and writes a placeholder `supabase-config.js`; the forms will show success but won’t send data to Supabase until you add your keys to `.env.local`.

---

## Production / Vercel (environment variables)

For production you can avoid putting keys in `supabase-config.js` by using build-time or runtime env vars.

1. In Vercel: **Project → Settings → Environment Variables**, add:
   - `SUPABASE_URL` = your Project URL  
   - `SUPABASE_ANON_KEY` = your anon public key  

2. If you use a build step that injects env into HTML, you can run the same generator (with `process.env.SUPABASE_URL` and `process.env.SUPABASE_ANON_KEY` from Vercel’s env) to produce `supabase-config.js` during build, so the static site keeps working without a separate backend.

For a static deploy with no build step, you can still generate `supabase-config.js` once before deploy using your local `.env.local` (or CI secrets), and deploy that file; the anon key is intended to be public, and RLS protects the data.

---

## Security summary

- **Anon key in the frontend** – by design; RLS limits what it can do.
- **RLS** – anonymous users can only insert into `demo_requests` and `contact_messages`; they cannot select, update, or delete.
- **service_role key** – never use in the browser; only in a backend or trusted script if you need to bypass RLS.

---

## Troubleshooting

- **“Failed to fetch” or network errors**  
  - Check Project URL and anon key.  
  - In Supabase → **Project Settings → API**, ensure the project URL matches and the anon key is copied in full.

- **403 or “new row violates row-level security”**  
  - Re-run `supabase/schema.sql` so the “Allow anonymous insert” policies exist on both tables.

- **Tables don’t exist**  
  - Run the full `supabase/schema.sql` in the SQL Editor once.

- **Forms don’t send data**  
  - Ensure you have a **`.env.local`** (copy from `.env.local.example`) with `SUPABASE_URL` and `SUPABASE_ANON_KEY` set, then run **`npm run dev`** so it generates **`supabase-config.js`**.  
  - Confirm `supabase-config.js` is loaded before `script.js` and that the URL/key are not the placeholders.  
  - Check the browser console for errors.

Once this is done, your Get Demo and Contact forms are fully connected to Supabase and you can manage leads and messages from the Table Editor or any tool that uses the Supabase API.
