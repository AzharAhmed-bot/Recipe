import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { AuthSession } from '@supabase/supabase-js';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isNavbarOpen = false;
  session: AuthSession | null = null;

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.fetchSession();
  }

  async fetchSession() {
    this.session = await this.supabase.getSession();
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  async signOut() {
    await this.supabase.logout();
    this.session = null;
  }
}
