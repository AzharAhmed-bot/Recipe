import { Injectable } from '@angular/core';
import { AuthSession, createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from './env/environment';
import { CategoryProps, NewRecipeProp, RecipeHealthProps, RecipeProps, ReviewProps } from '../Props/data.props';
import { BehaviorSubject } from 'rxjs';
import { recipes } from '../Data/recipe';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  private reviewSubject = new BehaviorSubject<any[]>([]);
  private categorySubject=new BehaviorSubject<CategoryProps[]>([]);
  private recipeHealthSubject=new BehaviorSubject<RecipeHealthProps[]>([]);
  public reviewChanges$ = this.reviewSubject.asObservable();
  public categoryChanges$=this.categorySubject.asObservable();
  public recipeHealthChanges$=this.recipeHealthSubject.asObservable();


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
    .select(`id,shelf_life,nutrition_benefit,potential_allergies`);

    if(error){
      console.error('Error fetching recipe health:', error.message);
    }
    const recipeHealth=data ?? []
    return recipeHealth
  }

  async allCategory():Promise<CategoryProps[]>{
    const {data,error}=await this.supabase
    .from('Category')
    .select('id,name')

    if(error){
      console.error("Erro fetching categories",error.message);
    }
    const categories=data ?? []
    return categories
  }


  async allRecipes() {
    const { data, error } = await this.supabase.schema('public').from("Recipe").select(`recipe_uid,id,image,title,instructions,preparation_time,serving_method,Reviews(review),Category(name),RecipeHealth(nutrition_benefit,potential_allergies)`);
    if (error) {
      console.error('Error fetching recipes:', error.message);
      return [];
    }
    const recipes=data ?? [];
    return recipes;
  }

  async addRecipe(recipe: NewRecipeProp) {
    const { data, error } = await this.supabase
      .from('Recipe')
      .insert({
        image: recipe.image,
        title: recipe.title,
        category_id: recipe.category_id,
        recipe_health_id: recipe.recipe_health_id,
        preparation_time: recipe.preparation_time,
        serving_method: recipe.serving_method,
        instructions: recipe.instructions,
        review_id:recipe.review_id
      });
  
    if (error) {
      console.error('Error adding recipe:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  }

  async updateRecipe(recipe_id:number,updatingData:any):Promise<any>{
    const {data,error}=await this.supabase
    .from('Recipe')
    .update({
      image:updatingData.image,
      title:updatingData.title,
      category_id:updatingData.category_id,
      recipe_health_id:updatingData.recipe_health_id,
      instructions:updatingData.instructions,
    })
    .eq('id',recipe_id)
    if(error){
      console.error('Error updating recipe:', error.message);
    }
    return {success:true,data}
  }

  async addReview(newReview:ReviewProps){
    let {data,error}=await this.supabase
    .from('Reviews')
    .insert({
      rating:newReview.rating,
      review:newReview.review
    })
    .select('id')
    .single()
    if(error){
      console.error('Error adding review:', error.message);
    }
    return {success:true,data}
  }
  async deleteReview(reviewId: number) {
    const { error } = await this.supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
  
    if (error) throw error;
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

  async allRecipesByUserId(id: string): Promise<RecipeProps[]> {
    const { data, error } = await this.supabase
      .from('Recipe')
      .select(`
        recipe_uid, id, image, title, instructions, preparation_time, serving_method,
        Reviews(review),
        Category(id,name),
        RecipeHealth(shelf_life, nutrition_benefit, potential_allergies)
      `)
      .eq('user_id', id);
  
    if (error) {
      console.error('Error fetching recipes:', error.message);
      return []; 
    }
  
    return data ?? []; 
  }
  
  subscribeToReviews() {
    const Reviews = this.supabase.channel('custom-all-channel').on('postgres_changes', { event: "*", schema: 'public', table: 'Reviews' }, (payload) => {
      console.log("Changes received", payload);
      this.allReviews().then((reviews) => {
        this.reviewSubject.next(reviews);
      });
    }).subscribe();
  }

  subscribeToCategories(){
    const categories=this.supabase
    .channel('custom-all-channel')
    .on('postgres_changes',{event:"*",schema:"public",table:"Category"},(payload)=>{
      this.allCategory().then((categories)=>{
        this.categorySubject.next(categories)
      })
    }).subscribe()
  }
  subscribeToRecipeHealth(){
    const categories=this.supabase
    .channel('custom-all-channel')
    .on('postgres_changes',{event:"*",schema:"public",table:"RecipeHealth"},(payload)=>{
      this.allRecipeHealth().then((recipeHealth)=>{
        this.recipeHealthSubject.next(recipeHealth)
      })
    }).subscribe()
  }





}
