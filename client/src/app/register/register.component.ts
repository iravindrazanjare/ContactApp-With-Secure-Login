import { Component, OnInit } from '@angular/core';
import { AuthService} from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {User} from '../users'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  SuccessMsg:string
  users: User[];
  user: User;
    _id: string;
  successMsg:string
  error:string
  email:string
  password:string
  activeIndex: any;
  constructor(private _auth: AuthService,
              private _router: Router) { }
              isShowDiv = false;
              isSShowDiv = true;
  ngOnInit() {
    this.getData();
  }
registerUser() {
  const newUser ={
    _id : this._id,
    email : this.email,
    password : this.password
  }
  if(this.activeIndex == undefined){
    this._auth.registerUser(newUser)
    .subscribe(
      res => {
        console.log(res) 
        localStorage.setItem('token', res.token)
        this._router.navigate(['/register'])
        this.successMsg = "Success => Proceed to login"
        window.location.reload();
      },
      err => {
        console.log(err)
         if( err instanceof HttpErrorResponse ) {
              if (err.status === 401) {
              this.error = err.error
              this._router.navigate(['/login'])
            }
         }
      } 
    )
  }else{
    console.log(newUser)
    this._auth.updateUserData(newUser).subscribe(data => {
        this.getData()
        window.location.reload();
       })
      this.successMsg = "User Updated Successfully";
  }
  }
  edit(obj,index){
    console.log(obj._id)
    this.email = obj.email;
    this.password = obj.password;
    this._id = obj._id;
    this.user=obj;
    this.activeIndex = obj._id;
    this.isShowDiv = !this.isShowDiv;
    this.isSShowDiv = !this.isSShowDiv;
  }

  deleteUser(id:any){
    var users = this.users;
    console.log("users are "+users)
    this._auth.deleteUser(id).subscribe(data => {
      if(data.n == 1){
        for(var i = 0;i<users.length;i++){
          if(users[i]._id == id){
            users.slice(i,1);
          }
        }
      }
    });
    this.getData();
  }
  getData(){
    this._auth.getUsers().subscribe(users => this.users = users);
  }
}
