import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { CategoryProps, RecipeHealthProps, RecipeProps } from 'src/Props/data.props';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-update-recipe',
  templateUrl: './update-recipe.component.html',
  styleUrls: ['./update-recipe.component.css']
})
export class UpdateRecipeComponent implements OnInit {
  recipeToUpdate:RecipeProps | null=null
  recipeHealths:RecipeHealthProps[] | undefined;
  categories: CategoryProps[] | undefined;
  selectedCategory: CategoryProps | null | undefined;
  selectedRecipeHealth:RecipeHealthProps| null | undefined;

  constructor(private recipeService:RecipeService,private supabase:SupabaseService){}

  ngOnInit(): void {
    this.supabase.allCategory().then((categories) => {
      this.categories = categories;
    });
    this.supabase.allRecipeHealth().then((recipeHealths) => {
      this.recipeHealths = recipeHealths;
    });
     this.recipeService.recipeData$.subscribe((data)=>{
      this.recipeToUpdate=data
      console.log(this.recipeToUpdate);
      if (this.recipeToUpdate) {
        this.selectedCategory = this.categories?.find(cat => 
          this.recipeToUpdate?.Category.some(c => c.name === cat.name)
        ) || null;

        // Find the first matching health information based on the recipe
        this.selectedRecipeHealth = this.recipeHealths?.find(health => 
          this.recipeToUpdate?.RecipeHealth.some(rh => rh.nutrition_benefit === health.nutrition_benefit)
        ) || null;
      }
    })
  }

  toggleCategory(category:CategoryProps){
      this.selectedCategory=this.selectedCategory===category? null: category  
  }
  removeCategory() {
    this.selectedCategory = null;
  }

  toggleRecipeHealth(recipeHealth:RecipeHealthProps){
    this.selectedRecipeHealth=this.selectedRecipeHealth===recipeHealth? null: recipeHealth
  }
  removeRecipeHealth(){
    this.selectedRecipeHealth = null;
  }
  updateRecipe(){}
}
