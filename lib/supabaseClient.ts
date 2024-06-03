import { createClient } from "@supabase/supabase-js";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBneW53bnZzd21ha3NqdXBxeXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0MTMxMjQsImV4cCI6MjAzMjk4OTEyNH0.HVOKzvS1xS_MrT-z9IGNejLIZdZyPYVu9xqCUJo-0es";

const SUPABASE_URL = "https://pgynwnvswmaksjupqytz.supabase.co";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
