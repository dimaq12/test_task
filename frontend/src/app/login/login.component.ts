import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from "../auth-service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  error: any;
  constructor(
    private loginService: AuthService,
    private readonly router: Router
  ) { }

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit(): void {
    if (this.form.valid) {
      const loginData = this.form.value;
      this.loginService.login(loginData)
    }
  }

  signUp(): void {
    this.router.navigate(["signup"])  
  }
}
