import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params } from '@angular/router';
import { error } from 'protractor';
import {User} from '../../models/user';
import { UserService } from "../../Services/user.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public title: string;
  public user:User;
  public status:string;
  public identity;
  public token;

  constructor(
  private _route: ActivatedRoute,
  private _router: Router,
  private _userService: UserService
  ) { 
    this.title ='Identificate';
    this.user = new User (
      "",    
      "",
      "",
      "",
      "",
      "",
      "",
      "");
  }

  ngOnInit() {
  }
  onSubmit(){

    // Logear al usuario y conseguir sus datos
    this._userService.login(this.user).subscribe(
      response =>{
        console.log(response.user);
        this.identity = response.user;
        if (!this.identity || !this.identity._id){
          this.status='error';

        }else{
          

          //Persistir datos del usuario
            localStorage.setItem('identity', JSON.stringify(this.identity));

          //Conseguir el token

          this.getToken();
        }          
      },
      error => {
        var erroMessage = <any>error;
        if(erroMessage !=null){
          this.status ='error';
        }
      }
    );
}

getToken (){
  this._userService.login(this.user, 'true').subscribe(
    response =>{
      console.log(response.token);
      this.token = response.token;
      if (this.token.length <= 0){
        this.status='error';
      }else{
        

        //Persistir el token del usuario
        localStorage.setItem('token',this.token)

        // Conseguir los contadores o estadisticas del usuario
        this.getCounters();
      }

    },
    error => {
      var erroMessage = <any>error;
      if(erroMessage !=null){
        this.status ='error'
      }
    }
  );
}
getCounters(){
  this._userService.getCounters().subscribe(
    response => {
      localStorage.setItem('stats', JSON.stringify(response));
      this.status = 'success';
        this._router.navigate(['/']);
    },
    error => {
      console.log(<any>error);
    }
  )
}

}
