import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../auth-service"

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  error = '';
  constructor(private authService: AuthService) { }

  form: FormGroup = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    confirm:  new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  submit() {
    const loginData = this.form.value;
    if(loginData.password !== loginData.confirm) {
      this.error = 'Please confirm the password';
      setTimeout(() => {
        this.error = '';
      }, 2000)
      return;
    }
    if (this.form.valid) {
      const loginData = this.form.value;
      this.authService.signUp(loginData).subscribe({
        next:(userData) => {
          this.authService.addToStorage(userData)
        },
        error: (err) => {
          this.error = err.error;
        }
      })
    } 
  }
}
