import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-detailed-recipes',
  templateUrl: './detailed-recipes.component.html',
  styleUrls: ['./detailed-recipes.component.css']
})
export class DetailedRecipesComponent implements OnInit {
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  uniqueCategories: string[] = [];
  loading: boolean = true;
  showRecipeForm: boolean = false;

  constructor(
    private supabase: SupabaseService,
    private toast: HotToastService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    this.loadRecipes();
  }

  async loadRecipes() {
    this.loading = true;
    try {
      this.recipes = await this.supabase.allRecipes();
      this.filteredRecipes = this.recipes;
      this.uniqueCategories = [...new Set(this.recipes.map(recipe => recipe.Category.name))];
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      this.loading = false;
    }
  }

  addToFavorites(recipe: any) {
    this.favoritesService.addFavorite(recipe);
    this.toast.success('Recipe added to favorites!');
  }

  filterRecipes() {
    this.filteredRecipes = this.recipes.filter(recipe => {
      const matchesName = recipe.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory ? recipe.Category.name === this.selectedCategory : true;
      return matchesName && matchesCategory;
    });
  }

  toggleRecipeForm() {
    this.showRecipeForm = !this.showRecipeForm;
  }

  handleCloseForm() {
    this.showRecipeForm = false;
  }
}
