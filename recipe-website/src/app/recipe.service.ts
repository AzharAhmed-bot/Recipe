import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RecipeProps } from 'src/Props/data.props';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor() { }

  private recipeData = new BehaviorSubject<RecipeProps | null>(null);
  recipeData$ = this.recipeData.asObservable();

  setRecipeData(recipe: RecipeProps) {
    this.recipeData.next(recipe);
  }
}
