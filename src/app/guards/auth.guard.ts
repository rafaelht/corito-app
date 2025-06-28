import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const { data: { user } } = await this.supabase.client.auth.getUser();
    if (user) {
      return true;
    } else {
      this.router.navigateByUrl('/auth');
      return false;
    }
  }
} 