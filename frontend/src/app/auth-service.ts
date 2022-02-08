import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from "../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any =  null
  constructor(
    protected readonly httpClient: HttpClient,
    private router:Router
  ) { }

  get getUser(){
    if(!this.user) {
      const stashedUserData = localStorage.getItem("user:data");
      this.user = stashedUserData ? JSON.parse(stashedUserData) : null;
    }
    
    return this.user;
  }

  login(userData: any): void {
    this.httpClient.post(`${ environment.API_URL }/login`, userData).subscribe((userData)=>{
      if(userData) {
        this.user = userData;
        localStorage.setItem("user:data", JSON.stringify(userData))
        this.router.navigate(["/files"])
      }
    })
  }

  signUp(signupData: Array<number>): void {
    this.httpClient.post(`${ environment.API_URL }/signup`, signupData).subscribe((userData)=>{
      if(userData) {
        this.user = userData;
        localStorage.setItem("user:data", JSON.stringify(userData))
        this.router.navigate(["/files"])
      }
    })
  }
}