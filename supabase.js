import { createClient } from "@supabase/supabase-js"

const URL = "https://dpdryxwsrzxdubdlxtmo.supabase.co"
const key = "sb_publishable_FKbO9Eku057Pu0nlvSrOsw_qd8LxiJu"
export const supabase = createClient(URL, key)