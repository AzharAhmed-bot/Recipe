import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { HotToastService } from '@ngneat/hot-toast';
import { from } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent {
  @Output() closeForm = new EventEmitter<void>();
  recipe = {
    title: '',
    image: '',
    preparation_time: '',
    serving_method: '',
    category: '',
    instructions: '',
    healthInfo: {
      shelf_life: '',
      nutrition_benefit: '',
      potential_allergies: ''
    }
  };

  constructor(
    private supabaseService: SupabaseService,
    private toast: HotToastService
  ) {}



  submitRecipe(form: NgForm) {
    if (form.valid) {
      console.log('Adding recipe...');
      this.toast.observe({
        loading: 'Adding recipe...',
        success: 'Recipe added successfully!',
        error: 'There was an error adding the recipe. Please try again.'
      })(from(this.supabaseService.addRecipe(this.recipe)))
      .subscribe(() => {
        console.log('Recipe added successfully!');
        this.closeForm.emit();
      }, (error) => {
        console.error('Error submitting recipe:', error);
      });
    } else {
      form.form.markAllAsTouched();
    }
  }

  close() {
    this.closeForm.emit();
  }
}
