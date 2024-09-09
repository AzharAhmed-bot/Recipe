import { Component } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { SupabaseService } from '../supabase.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {

  form:any;

  constructor(private supabase:SupabaseService){
    this.supabase=new SupabaseService();

    this.form = new FormGroup({
      firstName: new FormControl('',[
        Validators.required,
        Validators.minLength(4),
      ]),
      lastName:new FormControl('',[
        Validators.required,
        Validators.minLength(4),
      ]),
      email:new FormControl('',[
        Validators.required,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]),
      password:new FormControl('',[
        Validators.required,
        Validators.minLength(8),
      ])
    })
  }
  get firstName(){
    return this.form.get('firstName')
  }
  get lastName(){
    return this.form.get('lastName')
  }
  get email(){
    return this.form.get('email')
  }
  get password(){
    return this.form.get('password')
  }


  async onSignUp(){
    if(this.form.valide){
      const{email,password}=this.form.value;
      try{
        await this.supabase.loginWithEmailPassword(email,password);
        console.log(this.supabase._session);
      }catch(error){
        console.log('Sign-up failed:', error);
      }
    }
  }

  loginWithProvider(provider:string){
    this.supabase.loginWithProvider(provider);
    console.log(this.supabase._session);
  }

}
