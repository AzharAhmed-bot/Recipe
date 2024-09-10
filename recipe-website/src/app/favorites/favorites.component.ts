import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  loading = false;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loading = true;
    const favorites = localStorage.getItem('favorites')?.trim() ?? '[]';
    this.favorites = JSON.parse(favorites);
    this.loading = false;
  }

  removeFavorite(recipe: any) {
    this.favoritesService.removeFavorite(recipe);
    this.favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]');
  }
}
