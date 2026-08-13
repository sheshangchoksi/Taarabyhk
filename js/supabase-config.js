/* TaaraByHK — Supabase connection
   ------------------------------------------------------------
   1. Create a free project at https://supabase.com
   2. Run the SQL in /supabase-schema.sql inside the Supabase SQL editor
      (this creates the "orders" table and the admin login).
   3. Go to Project Settings → API in Supabase and copy:
        - "Project URL"      → paste into SUPABASE_URL below
        - "anon public" key  → paste into SUPABASE_ANON_KEY below
   4. Commit this file. The anon key is safe to expose publicly —
      it only has the limited permissions granted by the SQL policies.
   ------------------------------------------------------------ */

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co"; // TODO: replace
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY"; // TODO: replace

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient && window.supabase && SUPABASE_URL.indexOf("YOUR-PROJECT-REF") === -1) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

function supabaseConfigured() {
  return SUPABASE_URL.indexOf("YOUR-PROJECT-REF") === -1 && SUPABASE_ANON_KEY.indexOf("YOUR-ANON-PUBLIC-KEY") === -1;
}
