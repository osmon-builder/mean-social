import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from'@angular/router';
import { from } from 'rxjs';
import {User} from '../../models/user';
import {UserService} from '../../Services/user.service';
import {UploadService} from '../../Services/upload.service'
import { JsonpClientBackend } from '@angular/common/http';
import {GLOBAL} from '../../Services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title:String;
  public user:User;
  public identity;
  public token;
  public status:String;
  public url:String;

  constructor(
    private _route:ActivatedRoute,
    private _router: Router,
    private _userService:UserService,
    private _uploadService: UploadService
  
  ) {

    this.title ='Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity =this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(){
    console.log(this.user);
    console.log('user-edit.componet se ha cargado...');
  }
  onSubmint(){
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      response => {
        if(!response.user){
          this.status = 'error';
        }else{
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          // subida de imagen de usuario

          this._uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[], this.filesToUpload, this.token, 'image')
                      .then((result: any) =>{
                      
                        this.user.image = result.user.image;
                        localStorage.setItem('identity', JSON.stringify(this.user));
                      });
        }
      },
      error=> {
        var errorMenssage = <any>error;
        console.log(errorMenssage);

        if(errorMenssage != null){
          this.status = 'error';
        }
      }
    );
  }
  public filesToUpload:Array<File>

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);

  }

}
