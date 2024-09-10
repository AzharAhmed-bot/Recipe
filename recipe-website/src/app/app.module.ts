import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { HotToastModule } from '@ngneat/hot-toast';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HerosPageComponent } from './heros-page/heros-page.component';
import { ScrollTriggerDirective } from './heros-page/ScrollTriggerDirective ';
import { FooterComponent } from './footer/footer.component';
import { BlogComponent } from './blog/blog.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FaqComponent } from './faq/faq.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipesComponent } from './recipes/recipes.component';
import { DetailedRecipesComponent } from './detailed-recipes/detailed-recipes.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';



@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    NavbarComponent,
    HerosPageComponent,
    ScrollTriggerDirective,
    FooterComponent,
    BlogComponent,
    TestimonialsComponent,
    FaqComponent,
    ProfileComponent,
    RecipesComponent,
    DetailedRecipesComponent,
    AboutusComponent,
    FavoritesComponent,
    RecipeFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HotToastModule.forRoot()
  ],
  providers: [
    provideRouter([])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
