import { Component } from '@angular/core';
import { recipes } from 'src/Data/recipe';

@Component({
  selector: 'app-heros-page',
  templateUrl: './heros-page.component.html',
  styleUrls: ['./heros-page.component.css']
})
export class HerosPageComponent {
 recipes=recipes;
 

}

