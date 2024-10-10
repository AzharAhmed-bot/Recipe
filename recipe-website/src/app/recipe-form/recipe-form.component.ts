import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { CategoryProps, NewRecipeProp, RecipeHealthProps, ReviewProps } from 'src/Props/data.props';
import { Subscription } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { CloudinaryService } from '../cloudinary.service';
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
  selectedCategory: CategoryProps | null | undefined;
  selectedRecipeHealth:RecipeHealthProps| null | undefined;
  reviewContent:string=""
  reviewRating:number=0;
  hoverRatingValue:number=0
  handleSaveReview:boolean=false;
  loading:boolean=true;


  constructor(private supabase: SupabaseService, private toast:HotToastService,private cloudinary:CloudinaryService) {
    this.newRecipe = new FormGroup({
      title: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      instructions: new FormArray([]),
      servingMethod: new FormControl('', [Validators.required]),
      preparationTime: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
    // Fetch categories and recipe health data
    this.supabase.allCategory().then((categories) => {
      this.categories = categories;
    });
    this.supabase.allRecipeHealth().then((recipeHealths) => {
      this.recipeHealths = recipeHealths;
    });

    // Set up subscriptions to listen for changes in categories and recipe health
    this.supabase.subscribeToCategories();
    this.subscription = this.supabase.categoryChanges$.subscribe((categories) => {
      this.categories = categories;
    });
    
    this.supabase.subscribeToRecipeHealth();
    this.subscription.add(this.supabase.recipeHealthChanges$.subscribe((recipeHealths) => {
      this.recipeHealths = recipeHealths;
    }));
  }

  // File upload handler
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.newRecipe.get('image')?.setValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // Add instruction field dynamically
  addInstruction(): void {
    const instructionGroup = new FormGroup({
      instruction: new FormControl('', Validators.required)
    });
    (this.newRecipe.get('instructions') as FormArray).push(instructionGroup);
  }
  saveReview(){
    this.handleSaveReview=true
  }
  editReview(){
    this.handleSaveReview=false
  }
  setRating(value: number) {
    this.reviewRating = value;
  }

  hoverRating(value: number) {
    this.hoverRatingValue = value;
  }

  saveNewReview(newReview:ReviewProps){
    this.supabase.addReview(newReview)
  }
  

  // Remove specific instruction field
  removeInstruction(index: number): void {
    (this.newRecipe.get('instructions') as FormArray).removeAt(index);
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

  // Handle form submission
  addRecipe(): void {
    if (this.newRecipe.valid) {
      const instructions = (this.newRecipe.get('instructions') as FormArray).controls.map(control => control.get('instruction')?.value);
      this.recipeDetails = { 
        ...this.newRecipe.value,
        instructions 
      };
      this.newRecipe.reset();
      (this.newRecipe.get('instructions') as FormArray).clear();   
      console.log('Recipe added successfully:', this.recipeDetails);
    } else {
      console.error('Form is invalid');
    }
  }
  

  // Getters for form controls
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


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }



  async saveRecipe() {
    this.loading = true;
    const loadingToast = this.toast.loading('Saving recipe...');
    try {
      const imageUrl = await this.cloudinary.upload(this.recipeDetails.image);
      const reviewInfo: ReviewProps = {
        rating: this.reviewRating,
        review: this.reviewContent,
      };
  
      const newReview = await this.supabase.addReview(reviewInfo);
  
      if (newReview.success && newReview.data) {
        const reviewId = newReview.data.id; // Get the ID of the newly created review
  
        const recipeInfo: NewRecipeProp = {
          title: this.recipeDetails.title,
          preparation_time: this.recipeDetails.preparationTime,
          serving_method: this.recipeDetails.servingMethod,
          instructions: this.recipeDetails.instructions,
          category_id: this.selectedCategory ? this.selectedCategory.id : 0,
          recipe_health_id: this.selectedRecipeHealth?.id ?? 0,
          image: imageUrl,
          review_id: reviewId, 
        };
  
        await this.supabase.addRecipe(recipeInfo);
        loadingToast.close();
        this.toast.success('Recipe saved successfully!');
        this.newRecipe.reset();
        this.instructions.clear();
      } else {
        this.toast.error('Failed to save review');
      }
    } catch (error: any) {
      loadingToast.close();
      this.toast.error('Failed to save recipe: ' + error.message);
    } finally {
      this.loading = false;
    }
  }
  
  
  
}
