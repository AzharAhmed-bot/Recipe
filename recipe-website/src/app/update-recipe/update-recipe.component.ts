import { Component, OnInit,HostListener } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { CategoryProps, RecipeHealthProps } from 'src/Props/data.props';
import { SupabaseService } from '../supabase.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudinaryService } from '../cloudinary.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-update-recipe',
  templateUrl: './update-recipe.component.html',
  styleUrls: ['./update-recipe.component.css']
})
export class UpdateRecipeComponent implements OnInit {
  recipeToUpdate: any | null = null;
  categories: CategoryProps[] = [];
  recipeHealths: RecipeHealthProps[] = [];
  selectedCategory: CategoryProps | null = null;
  selectedRecipeHealth: RecipeHealthProps | null = null;
  isEditingInstructions: boolean[] = [];
  isEditingReview: boolean = false;
  instructionsForm: FormGroup;
  reviewForm: FormGroup;
  recipeTitleForm:FormGroup;
  hasUnsavedChanges: boolean = false;
  isEditingTitle: boolean = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService, 
    private supabase: SupabaseService,
    private router:Router,
    private cloudinary:CloudinaryService,
    private toast:HotToastService
  ) {
    // Initialize forms with FormBuilder
    this.instructionsForm = this.fb.group({
      instructions: this.fb.array([])
    });
    this.reviewForm = this.fb.group({
      review: ['']
    });
    this.recipeTitleForm=this.fb.group({
      title: ['']
    })
  }
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
   if(this.hasUnsavedChanges){
    event.preventDefault();
   } 
  }

  @HostListener('window:popstate', ['$event'])
  handlePopState(event: PopStateEvent) {
    if(this.hasUnsavedChanges){
      if(confirm('Are you sure you want to leave?')){
        this.router.navigate(['/profile'])
      }
      else{
        history.pushState(null, '', window.location.pathname);
      }
    }
  } 

  get instructions() {
    return this.instructionsForm.get('instructions') as FormArray;
  }

  ngOnInit(): void {
    // Load categories and recipe health data
    this.loadCategories();
    this.loadRecipeHealths();
    
    // Subscribe to recipe data changes
    this.recipeService.recipeData$.subscribe((data) => {
      if (data) {
        this.recipeToUpdate = data;
        this.initializeFormsWithData();
        this.setInitialSelections();
        console.log(this.recipeToUpdate);
      }
    });
  }

  private setupFormChangeListeners(): void {
    // Listen for changes in instructions form
    this.instructionsForm.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = true;
    });

    // Listen for changes in review form
    this.reviewForm.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = true;
    });
  }

  private async loadCategories(): Promise<void> {
    try {
      this.categories = await this.supabase.allCategory();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  private async loadRecipeHealths(): Promise<void> {
    try {
      this.recipeHealths = await this.supabase.allRecipeHealth();
    } catch (error) {
      console.error('Error loading recipe healths:', error);
    }
  }

  private initializeFormsWithData(): void {
    // Clear existing form arrays
    while (this.instructions.length) {
      this.instructions.removeAt(0);
    }

    // Add new form controls for each instruction
    if (this.recipeToUpdate.instructions && Array.isArray(this.recipeToUpdate.instructions)) {
      this.recipeToUpdate.instructions.forEach((instruction: string) => {
        this.instructions.push(this.fb.control(instruction));
      });
    }

    // Set review form value
    this.reviewForm.patchValue({
      review: this.recipeToUpdate.review || ''
    });

    // Set recipe title form value
    this.recipeTitleForm.patchValue({
      title: this.recipeToUpdate.title || ''
    });
  }

  private setInitialSelections(): void {
    // Set initial category selection
    this.selectedCategory = this.categories.find(cat =>
      this.recipeToUpdate?.Category?.some((c: any) => c.name === cat.name)
    ) || null;

    // Set initial recipe health selection
    this.selectedRecipeHealth = this.recipeHealths.find(health =>
      this.recipeToUpdate?.RecipeHealth?.some((rh: any) => rh.nutrition_benefit === health.nutrition_benefit)
    ) || null;
  }

  toggleCategory(category: CategoryProps): void {
    this.selectedCategory = this.selectedCategory === category ? null : category;
    this.hasUnsavedChanges=true;
  }

  toggleRecipeHealth(health: RecipeHealthProps): void {
    this.selectedRecipeHealth = this.selectedRecipeHealth === health ? null : health;
    this.hasUnsavedChanges=true;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.recipeToUpdate) {
          this.recipeToUpdate.image = reader.result as string;
          this.hasUnsavedChanges=true
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addInstruction(): void {
    this.instructions.push(this.fb.control(''));
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }

  saveInstructions(): void {
    if (this.recipeToUpdate) {
      this.recipeToUpdate.instructions = this.instructions.value;
    }
  }

  editReview(){
    this.isEditingReview=true;
  }
  saveReview(): void {
    if (this.recipeToUpdate) {
      this.recipeToUpdate.review = this.reviewForm.get('review')?.value;
      this.isEditingReview=false;
    }
  }
  editTitle(): void {
    this.isEditingTitle = true;
  }
  
  saveTitle(): void {
    if(this.recipeToUpdate){
      this.recipeTitleForm.patchValue({
        title: this.recipeToUpdate.title
      });
      this.isEditingTitle = false;
    }
  }

  async logSavedChanges(): Promise<void> {
    const loadingToast=this.toast.loading("Saving changes...");
    if (!this.recipeToUpdate) return;
    const imageUrl=await this.cloudinary.upload(this.recipeToUpdate.image);
    const updates = {
      category_id: this.selectedCategory?.id,
      recipe_health_id: this.selectedRecipeHealth?.id,
      instructions: this.instructions.value,
      review: this.reviewForm.get('review')?.value,
      image: imageUrl,
      title: this.recipeToUpdate.title
    };
  
    try {
      // Call the updateRecipe function
      await this.supabase.updateRecipe(this.recipeToUpdate.id, updates);
      this.hasUnsavedChanges = false;
      loadingToast.close();
      this.toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      loadingToast.close();
      this.toast.error('Failed to save changes.');
    }
  }
  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }
}