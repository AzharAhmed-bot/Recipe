import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HerosPageComponent } from './heros-page/heros-page.component';
import { FaqComponent } from './faq/faq.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './auth.guard';
import { DetailedRecipesComponent } from './detailed-recipes/detailed-recipes.component';
const routes: Routes = [
  {path:"",component:HerosPageComponent},
  { path: 'register', component: SignUpComponent },
  {path:"faqs", component:FaqComponent},
  {path:"profile", component:ProfileComponent,canActivate:[authGuard], },
  {path:"recipes", component:DetailedRecipesComponent,canActivate:[authGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
