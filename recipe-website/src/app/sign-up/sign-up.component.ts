import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  form:any;

  constructor(){
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


  onSignUp(){
    console.log(this.form.value);
  }

}
