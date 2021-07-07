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
    selector: 'All-songs',
    templateUrl: '../views/all-songs.html',
    providers: [UserService,SongService]
})

export class AllSongsComponent implements OnInit {
    public titulo: string;
    public songs:Song[];
    public identity;
    public token;
    public url: string;
    public alertMessage;

    public next_page;
    public prev_page;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService:SongService
    ) {  
        this.titulo = 'Todas las canciones';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
       // this.song = new Song(1,'', '' ,'','');
    }

    ngOnInit() {
        console.log('all-songs.component.ts cargado');
        //Lamar al metodo del api para sacar un artista en base a su id getArtist
        this.allSongs(); 
    }
    allSongs(){
        this._route.params.forEach((params: Params) => {
            let page = +params['page'];
            if(!page){
                page = 1;
            }else{
                this.next_page = page+1;
                this.prev_page = page-1;
                
                if(this.prev_page == 0){
                    this.prev_page = 1;
                } 
            }
            this._songService.allSongs(this.token, page).subscribe(
                response => {
                    if (!response.songs) {
                        this._router.navigate(['/']);
                        console.log(this.songs);
                    } else {
                        this.songs = response.songs;
                        console.log(this.songs);
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                        console.log(error);

                    }
                }
            )
        });
    }
    startPlayer(song){
        let song_player = JSON.stringify(song);
        let file_path= this.url+'get-song-file/'+song.file;
        let image_path = this.url+'get-image-album/'+song.album.image;

        localStorage.setItem('sound_song',song_player);
        document.getElementById("mp3-source").setAttribute("src",file_path);
        (document.getElementById("player")as any).load();
        (document.getElementById("player")as any).play();
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src',image_path);
    }
}