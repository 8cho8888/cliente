import { componentModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { uploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { from } from 'rxjs/observable/from';


@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService,AlbumService,uploadService]
})

export class AlbumEditComponent implements OnInit {
    public titulo: string;

    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService:uploadService

    ) {
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '',2017 ,'','');
        this.is_edit=true; 
    }

    ngOnInit() {
        console.log('album-edit.component.ts cargado');
        //Lamar al metodo del api para sacar el album en base a su id getArtist
        this.getAlbum();
    }
    getAlbum(){
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
            this._albumService.getAlbum(this.token,id).subscribe(
                response =>{
                    //this.artist = response.artist;
                    if(!response.album){
                        //this.alertMessage='Error en el servidor';
                        this._router.navigate(['/']);
                    }else{
                        //this.alertMessage='El album se ha creado correctamente!';
                        this.album = response.album;
                        //this._router.navigate(['/editar-artista', response.artist._id]);
    
                    }
                },
                    error =>{
                        var errorMessage = <any>error;            
                        if (errorMessage != null) {
                          var body = JSON.parse(error._body);
                          //this.alertMessage = body.message;
                          console.log(error);
                
                        }
                      }
            );
        })
    }
    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let id=params['id'];
            this._albumService.editAlbum(this.token,id,this.album).subscribe(
                response =>{
                    //this.artist = response.artist;
                    if(!response.album){
                        this.alertMessage='Error en el servidor';
                    }else{
                        this.alertMessage='El album se ha editado correctamente!';
                        if(!this.filesToUpload){
                            //redirigir
                            this._router.navigate(['/artista',response.album.artist]);
                        }else{
                            //Subir imagen
                                this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                                        .then(
                                  (result) => {
                             this._router.navigate(['/artista',response.album.artist]);
                             },
                         (error) => {
                         console.log(error);
                                    }
                         );
                        }
                      
                    }
                },
                    error =>{
                        var errorMessage = <any>error;            
                        if (errorMessage != null) {
                          var body = JSON.parse(error._body);
                          this.alertMessage = body.message;
                          console.log(error);
                
                        }
                      }
            );

            
        });
        console.log(this.album);
        
    }
    public filesToUpload:Array<File>;
     fileChangeEvent(fileInput:any){
         this.filesToUpload= <Array<File>>fileInput.target.files;
     }
  }