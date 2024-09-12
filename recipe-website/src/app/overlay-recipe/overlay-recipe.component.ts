// overlay-recipe.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RecipeProps } from 'src/Props/data.props';

@Component({
  selector: 'app-overlay-recipe',
  templateUrl: './overlay-recipe.component.html',
  styleUrls: ['./overlay-recipe.component.css']
})
export class OverlayRecipeComponent implements OnChanges {
  @Input() selectedRecipe!: RecipeProps;
  isVisible: boolean = true; // Control the visibility of the overlay

  recipe: RecipeProps = {
    recipe_uid: '',
    id: 0,
    image: '',
    title: '',
    instructions: [],
    preparation_time: '',
    serving_method: '',
    Reviews: [],
    Category: [],
    RecipeHealth: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRecipe'] && changes['selectedRecipe'].currentValue) {
      this.recipe = changes['selectedRecipe'].currentValue;
      this.isVisible = true;
    }
  }

  onClose(): void {
    this.isVisible = false; 
  }
}
