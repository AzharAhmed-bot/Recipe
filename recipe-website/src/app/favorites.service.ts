import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesCountSubject = new BehaviorSubject<number>(0);
  favoritesCount$ = this.favoritesCountSubject.asObservable();

  constructor() {
    const storedFavorites = localStorage.getItem('favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    this.favoritesCountSubject.next(favorites.length);
  }

  addFavorite(recipe: any) {
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    if (!favorites.find((fav:any) => fav.id === recipe.id)) {
      favorites.push(recipe);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.favoritesCountSubject.next(favorites.length);
    }
  }

  removeFavorite(recipe: any) {
    const storedFavorites = localStorage.getItem('favorites') ?? '[]';
    const parsedFavorites = JSON.parse(storedFavorites);
    const updatedFavorites = parsedFavorites.filter((fav:any) => fav.id !== recipe.id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    this.favoritesCountSubject.next(updatedFavorites.length);
  }

  getFavoritesCount() {
    return this.favoritesCountSubject.asObservable();
  }
}
