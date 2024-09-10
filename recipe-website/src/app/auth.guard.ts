import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { AuthSession } from '@supabase/supabase-js';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  // Dont instantiate but rather inject them
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  const session: AuthSession | null = await supabase.getSession();
  if (session) {
    return true;
  } else {
    router.navigate(['/register']);
    return false;
  }
};
