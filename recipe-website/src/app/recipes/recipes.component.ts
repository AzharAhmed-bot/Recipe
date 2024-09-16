import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { RecipeProps } from 'src/Props/data.props';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  recipes: RecipeProps[] = [];
  @Output() recipeSelected = new EventEmitter<any>();
  selectedRecipe: any;
  private subscription: Subscription | undefined;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.supabase.allRecipes().then((recipes) => {
      this.recipes = recipes;
      console.log(this.recipes);
    });

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); 
  }

}
