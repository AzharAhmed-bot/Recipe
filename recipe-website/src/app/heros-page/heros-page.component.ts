import { Component } from '@angular/core';
import { recipes } from 'src/Data/recipe';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-heros-page',
  templateUrl: './heros-page.component.html',
  styleUrls: ['./heros-page.component.css']
})
export class HerosPageComponent {
 recipes:any;

 constructor(private supabase: SupabaseService) {
   this.supabase.allRecipes().then(recipes => {
     this.recipes = recipes;
     console.log(this.recipes);
   });
 }

}

