import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { AuthSession } from '@supabase/supabase-js';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  session: AuthSession | null = null;

  constructor(private supabase: SupabaseService) {
    this.form = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ])
    });
  }

  async ngOnInit(): Promise<void> {
    await this.fetchSession();
  }

  async fetchSession() {
    this.session = await this.supabase.getSession();
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  async onSignUp() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      try {
        await this.supabase.loginWithEmailPassword(email, password);
        this.session = await this.supabase.getSession(); // Update session after login
        console.log(this.session);
      } catch (error) {
        console.log('Sign-up failed:', error);
      }
    } else {
      console.log('Form is not valid');
    }
  }

  async loginWithProvider(provider: string) {
    await this.supabase.loginWithProvider(provider);
    this.session = await this.supabase.getSession(); // Update session after login
    console.log(this.session);
  }
}
