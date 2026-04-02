/**
 * Reads .env.local and writes supabase-config.js so the static site
 * can use Supabase without committing secrets. Run before dev/start.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env.local');
const outPath = path.join(root, 'supabase-config.js');

if (!fs.existsSync(envPath)) {
  // No .env.local: write placeholder so the app still runs (forms won't persist)
  const placeholder = `/**
 * Supabase config. Copy .env.local.example to .env.local and add your keys,
 * then run \`npm run dev\` to generate this file from .env.local.
 */
window.SUPABASE_URL = 'YOUR_SUPABASE_URL';
window.SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
`;
  fs.writeFileSync(outPath, placeholder);
  console.log('No .env.local found – wrote placeholder supabase-config.js');
  process.exit(0);
}

// Simple .env parser (handles KEY=value and # comments)
const env = {};
const content = fs.readFileSync(envPath, 'utf8');
content.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eq = trimmed.indexOf('=');
  if (eq === -1) return;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
});

const url = env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const anonKey = env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const isPlaceholder = !url || !anonKey ||
  url === 'YOUR_SUPABASE_URL' || url.includes('YOUR_PROJECT_REF') ||
  anonKey === 'YOUR_SUPABASE_ANON_KEY' || anonKey === 'your-anon-public-key-here';

// If .env.local has placeholders and supabase-config.js already exists, don't overwrite it
if (isPlaceholder && fs.existsSync(outPath)) {
  console.log('supabase-config.js already exists; not overwriting with placeholders. Save your real keys in .env.local and run again to regenerate.');
  process.exit(0);
}

const output = `/**
 * Generated from .env.local – do not commit. Run \`npm run dev\` to regenerate.
 */
window.SUPABASE_URL = ${JSON.stringify(url)};
window.SUPABASE_ANON_KEY = ${JSON.stringify(anonKey)};
`;

fs.writeFileSync(outPath, output);
console.log('Generated supabase-config.js from .env.local');
