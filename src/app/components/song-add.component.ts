import { componentModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
//import { uploadService } from '../services/upload.service';
//import { ArtistService } from '../services/artist.service';
//import { AlbumService } from '../services/album.service';
import { Song } from '../models/song';
//import { Album } from '../models/album';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService,SongService]
})

export class SongAddComponent implements OnInit {
    public titulo: string;
    public song:Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService:SongService
    ) {
        this.titulo = 'Crear canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,'', '','' ,'','');
    }

    ngOnInit() {
        console.log('song-add.component.ts cargado');
        //Lamar al metodo del api para sacar un artista en base a su id getArtist
    }
    onSubmit(){ 
        this._route.params.forEach((params:Params)=>{
            let album_id=params['id'];
            this.song.album = album_id;
            console.log(this.song);
        
            this._songService.addSong(this.token,this.song).subscribe(
                response =>{
                    //this.artist = response.artist;
                    if(!response.song){
                        this.alertMessage='Error en el servidor';
                    }else{
                        this.alertMessage='La canción se ha creado correctamente!';
                        this.song = response.song;
                        this._router.navigate(['/editar-tema', response.song._id]);
    
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
        
    }   
  }