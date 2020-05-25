import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './users';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  private _registerUrl = "http://localhost:3000/api/register"
  private _loginUrl ="http://localhost:3000/api/login";  
  constructor(private http : HttpClient,
              private _router : Router) { }

  registerUser(user){
    return this.http.post<any>(this._registerUrl, user)
  }

  updateUserData(info): Observable<any>{
    return this.http.put('http://localhost:3000/api/users/'+info._id,info).pipe(
      tap(status => console.log("status: " + status)),
      catchError(this.handleError)
    )
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/users')
  }

  deleteUser(_id): Observable<any> {
    console.log('Record delete for ID :'+_id)
    return this.http.delete<any>('http://localhost:3000/api/users/'+_id).pipe(
        tap(status => console.log("status: " + status)),
        catchError(this.handleError)
    );
  }
  handleError(handleError: any): import("rxjs").OperatorFunction<unknown, any> {
    throw new Error("Method not implemented.");
  }

  loginUser(user){
    return this.http.post<any>(this._loginUrl, user)
  }

  loggedIn(){
    return !!localStorage.getItem('token')
  }

  logoutUser (){
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    this._router.navigate(['/login'])
  }

  checkUser(){
    var value = localStorage.getItem('currentUser')
    if(value == 'Admin'){
      return true
    }else{
      return false
    }
  }

  getToken(){
    return localStorage.getItem('token')
  }
}
