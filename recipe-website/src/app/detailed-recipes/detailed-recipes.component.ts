import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';

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

  constructor(private supabase: SupabaseService) { }

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

  filterRecipes() {
    this.filteredRecipes = this.recipes.filter(recipe => {
      const matchesName = recipe.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory ? recipe.Category.name === this.selectedCategory : true;
      return matchesName && matchesCategory;
    });
  }
}
