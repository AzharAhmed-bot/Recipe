import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { AuthSession } from '@supabase/supabase-js';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = new SupabaseService();
  const router=new Router();
  const session: AuthSession | null = await supabase.getSession();
  if (session) {
    return true;
  } else {
    router.navigate(["/register"])
    return false;

  }
};