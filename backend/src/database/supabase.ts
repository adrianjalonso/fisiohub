import { createClient } from "@supabase/supabase-js"
import "dotenv/config"

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey){
  throw new Error("Variaveis de ambiente do supabase não configuradas.")
}


export const supabase = createClient(supabaseUrl,supabaseKey);