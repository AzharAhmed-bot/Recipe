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
 
}
