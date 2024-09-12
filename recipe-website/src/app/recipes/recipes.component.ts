import { Component, Output,EventEmitter } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { RecipeProps } from 'src/Props/data.props';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  recipes:RecipeProps[] | undefined;
  @Output() recipeSelected=new EventEmitter<any>();
  selectedRecipe: any;

 constructor(private supabase: SupabaseService) {
   this.supabase.allRecipes().then(recipes => {
     this.recipes = recipes;
     console.log(this.recipes);
   });
 }

 onRecipeSelected(recipe: any): void {
  this.selectedRecipe = recipe;
}
}
