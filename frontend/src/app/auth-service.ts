import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from "../environments/environment"
import { Observable, Subscription } from 'rxjs';

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

  login(userData: any): Observable<any> {
    return this.httpClient.post(`${ environment.API_URL }/login`, userData)
  }

  signUp(signupData: Array<number>):Observable<any> {
    return this.httpClient.post(`${ environment.API_URL }/signup`, signupData)
  }

  logOut(): void{
    localStorage.removeItem("user:data");
    this.router.navigate(["/login"])
  }

  addToStorage(userData: any): void {
    this.user = userData;
    localStorage.setItem("user:data", JSON.stringify(userData))
    this.router.navigate(["/files"])
  }
}
