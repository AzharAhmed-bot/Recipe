import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { AuthSession } from '@supabase/supabase-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  session: AuthSession | null = null;
  token: any = null;
  expiresInInterval: any;
  timeLeft: number | undefined; 
  user = '';
  email = '';
  image = '';

  constructor(private supabase: SupabaseService) { }

  ngOnInit(): void {
    this.fetchSession();
  }

  ngOnDestroy(): void {
    clearInterval(this.expiresInInterval);
  }

  async fetchSession() {
    this.session = await this.supabase.getSession();
    this.updateProfile();
  }

  private updateProfile() {
    if (this.session) {
      const tokenString = localStorage.getItem("sb-tzklbtqifjjipazcakvd-auth-token");
      if (tokenString) {
        this.token = JSON.parse(tokenString);
        this.user = this.token.user.user_metadata.fullname;
        this.email = this.token.user.email;
        this.image = this.token.user.user_metadata.picture;
  
        // Check and log session expiration details
        console.log('Session expires at (Unix Timestamp):', this.session.expires_at);
  
        // Calculate the time left until session expiration
        const currentTime = new Date().getTime();
        const expiresAt = this.session.expires_at ? new Date(this.session.expires_at * 1000).getTime() : currentTime;
        this.timeLeft = Math.max(0, Math.floor((expiresAt - currentTime) / 1000));
        
        // Log time left
        console.log('Initial time left:', this.timeLeft);
  
        // Update the remaining time every second
        this.expiresInInterval = setInterval(() => {
          if (this.timeLeft && this.timeLeft > 0) {
            this.timeLeft -= 1;
          } else {
            clearInterval(this.expiresInInterval);
            this.timeLeft = 0;
          }
        }, 1000);
      } else {
        this.token = null;
      }
    }
  }
  

  getExpiresIn(): string {
    if (this.timeLeft === undefined || this.timeLeft <= 0) return 'Unknown';

    const hours = Math.floor(this.timeLeft / 3600);
    const minutes = Math.floor((this.timeLeft % 3600) / 60);
    const seconds = this.timeLeft % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  async logout() {
    await this.supabase.logout();
    localStorage.removeItem("sb-tzklbtqifjjipazcakvd-auth-token");
    this.token = null;
  }
}