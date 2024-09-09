import { Injectable } from '@angular/core';
import { AuthChangeEvent,AuthSession,createClient,Session,SupabaseClient,User } from '@supabase/supabase-js';
import { environment } from './env/environment';
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase:SupabaseClient
  _session:AuthSession | null=null
  constructor() { 
    this.supabase=createClient(environment.supabaseUrl,environment.supabaseKey);
  }

  get session(){
    this.supabase.auth.getSession().then(({data})=>{
      this._session=data.session
    })
    return this._session;
  }

  async loginWithProvider(provider: any){
    const {error}=await this.supabase.auth.signInWithOAuth({provider});
    if(error){
      console.log(`Error logging in with ${provider}:`, error.message);
    }
  }

  async loginWithEmailPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      console.log('Error logging in with email and password:', error.message);
    } else {
      console.log('Logged in successfully:', data);
      this._session=data.session
    }
  }
  

  async logout(){
    const {error}=await this.supabase.auth.signOut();
    if(error){
      console.log(`Error logging out:`, error.message);
    }
  }

}
