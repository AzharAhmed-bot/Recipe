import { Injectable } from '@angular/core';
import { AuthSession, createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from './env/environment';
import { RecipeHealthProps, RecipeProps, ReviewProps } from '../Props/data.props';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  private reviewSubject = new BehaviorSubject<any[]>([]);
  public reviewChanges$ = this.reviewSubject.asObservable();
  public _recipeCache:RecipeProps[] |null=null;


  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getSession(): Promise<AuthSession | null> {
    const { data } = await this.supabase.auth.getSession();
    this._session = data.session;
    return this._session;
  }

  async loginWithProvider(provider: any) {
    const { error } = await this.supabase.auth.signInWithOAuth({ provider });
    if (error) {
      console.log(`Error logging in with ${provider}:`, error.message);
    } else {
      const session = await this.getSession();
      if (session) {
        console.log('Logged in successfully, session:', session);
      }
    }
  }

  async loginWithEmailPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      console.log('Error logging in with email and password:', error.message);
    } else {
      console.log('Logged in successfully:', data);
      this._session = data.session;
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.log(`Error logging out:`, error.message);
    }
  }

  async allRecipeHealth():Promise<RecipeHealthProps[]>{
    const {data,error}=await this.supabase
    .from('RecipeHealth')
    .select(`shelf_life,nutrition_benefit,potential_allergies`);

    if(error){
      console.error('Error fetching recipe health:', error.message);
    }
    const recipeHealth=data ?? []
    return recipeHealth
  }

  async allRecipes() {
    if(this._recipeCache){
      return this._recipeCache
    }
    const { data, error } = await this.supabase.schema('public').from("Recipe").select(`recipe_uid,id,image,title,instructions,preparation_time,serving_method,Reviews(review),Category(name),RecipeHealth(nutrition_benefit,potential_allergies)`);
    if (error) {
      console.error('Error fetching recipes:', error.message);
      return [];
    }
    this._recipeCache=data ?? [];
    return this._recipeCache;
  }


  async allReviews(): Promise<ReviewProps[]> {
    let { data, error } = await this.supabase
      .from('Reviews')
      .select(`id,review,rating`);
  
    if (error) {
      console.error('Error fetching reviews:', error.message);
      return [];
    }
    const reviews = data ?? [];
    return reviews;
  }

  subscribeToReviews() {
    const Reviews = this.supabase.channel('custom-all-channel').on('postgres_changes', { event: "*", schema: 'public', table: 'Reviews' }, (payload) => {
      console.log("Changes received", payload);
      this.allReviews().then((reviews) => {
        this.reviewSubject.next(reviews);
      });
    }).subscribe();
  }



}
