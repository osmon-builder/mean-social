import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../Services/user.service';
import { GLOBAL } from '../../Services/global';
import { error } from 'protractor';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {

  public title:String;
  public identity;
  public token;
  public page;
  public total;
  public pages;
  public next_page;
  public prev_page;
  public users: User[];
  public status: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
  
  ) {
    this.title = 'Gente';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    console.log("user.componente ha sido cargado");
    this.actualPage();
  }
// signo mas para que sea un entero
  actualPage(){
    this._route.params.subscribe(params => {
      let page = +params['page'];
      

      if(!page){
        page = 1;
      }else{  
        this.page = page;
        this.next_page = page+1;
        this.prev_page = page-1;

        if(this.prev_page <= 0){
          this.prev_page = 1;
        }
        
      }
      //Devovler listado de usuarios
      this.getUsers(page);
      
    });
  }

  getUsers(page){
    this._userService.getUsers(page).subscribe(
      response => {
        if(!response.users){
          this.status = 'error';
        }else{
          console.log(response.users);
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          if(page > this.pages){
          this._router.navigate(['/gente']);
          }
        }
      },
      error =>{
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage !=null){
          this.status ='error';
        }
      }
    );
  }
}
