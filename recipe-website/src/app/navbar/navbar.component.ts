import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { AuthSession } from '@supabase/supabase-js';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isNavbarOpen = false;
  session: AuthSession | null = null;
  favourites: number = 0;

  constructor(
    private supabase: SupabaseService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.fetchSession();
    this.favoritesService.getFavoritesCount().subscribe(count => {
      this.favourites = count;
    });
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
