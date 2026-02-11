import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xitqzsdpjvapbrtshxiv.supabase.co";
const supabaseAnonKey = "sb_publishable_PC0YjxmOJFiTrwO_t_4TEw_5vfyn5Rm";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
