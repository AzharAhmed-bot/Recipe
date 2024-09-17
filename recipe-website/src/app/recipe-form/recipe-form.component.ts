import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { CategoryProps, RecipeHealthProps } from 'src/Props/data.props';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit, OnDestroy {
  categories: CategoryProps[] | undefined;
  recipeHealths: RecipeHealthProps[] | undefined;
  recipeDetails: any = null;
  subscription: Subscription | undefined;
  newRecipe: FormGroup;

  constructor(private supabase: SupabaseService) {
    this.newRecipe = new FormGroup({
      title: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      instructions: new FormArray([]),
      servingMethod: new FormControl('', [Validators.required]),
      preparationTime: new FormControl('', [Validators.required]),
      category: new FormControl('' ),
      recipeHealth: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.supabase.allCategory().then((categories) => {
      this.categories = categories;
    });
    this.supabase.allRecipeHealth().then((recipeHealths) => {
      this.recipeHealths = recipeHealths;
    });
    this.supabase.subscribeToCategories();
    this.supabase.categoryChanges$.subscribe((categories) => {
      this.categories = categories;
      console.log('Updated the categories');
    });
    this.supabase.subscribeToRecipeHealth();
    this.supabase.recipeHealthChanges$.subscribe((recipeHealths) => {
      this.recipeHealths = recipeHealths;
      console.log('Updated the recipeHealths');
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.newRecipe.get('image')?.setValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  addInstruction(): void {
    (this.newRecipe.get('instructions') as FormArray).push(new FormControl(''));
  }

  removeInstruction(index: number): void {
    (this.newRecipe.get('instructions') as FormArray).removeAt(index);
  }

  addRecipe(): void {
    if (this.newRecipe.valid) {
      this.recipeDetails = { ...this.newRecipe.value };
    } else {
      console.error('Form is invalid');
    }
  }

  drop(event: any): void {
    const draggedItem = event.item.data;
    if (draggedItem.category) {
      this.newRecipe.get('category')?.setValue(draggedItem.category);
    } else if (draggedItem.recipeHealth) {
      this.newRecipe.get('recipeHealth')?.setValue(draggedItem.recipeHealth);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get title() {
    return this.newRecipe.get('title');
  }

  get image() {
    return this.newRecipe.get('image');
  }

  get instructions() {
    return this.newRecipe.get('instructions') as FormArray;
  }

  get servingMethod() {
    return this.newRecipe.get('servingMethod');
  }

  get preparationTime() {
    return this.newRecipe.get('preparationTime');
  }

  get category() {
    return this.newRecipe.get('category');
  }

  get recipeHealth() {
    return this.newRecipe.get('recipeHealth');
  }
}
