import { Component } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  recipes:any;

 constructor(private supabase: SupabaseService) {
   this.supabase.allRecipes().then(recipes => {
     this.recipes = recipes;
     console.log(this.recipes);
   });
 }
}
