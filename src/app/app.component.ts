import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import{ GLOBAL} from './services/global';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { from } from 'rxjs/observable/from';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  title = 'SIZART';
  public user: User;
  public user_register:User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url;
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');  
    this.url = GLOBAL.url;
  }
  ngOnInit() {
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);
  }
  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token=null;
    this._router.navigate(['/']);
  }
  public onSubmit() {
    //conseguir los datos del usuario identificado
    console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert("El usuario no esta correctamente identificado")
        } else {
          //Crear elemento en el local storage
          localStorage.setItem('identity',JSON.stringify(identity));

          //conseguir el token para usuarlo en  las peticiones
          this._userService.signup(this.user,'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token.length <= 0) {
                alert("El token no se ha generado correctamente")
              } else {
                //Crear elemento en el local storage para tener el token disponible
                localStorage.setItem('token',token);   
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');

                //conseguir el token para usuarlo en  las peticiones
              }
            },
            error => {
              var errorMessage = <any>error;

              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);

              }

            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);

        }

      }
    );
  }
  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response =>{
        let user =response.user;
        this.user_register =user;
        if(!user._id){
          this.alertRegister= "Error al registrarse";
        }
        else{
          this.alertRegister="El registro se ha realizado correctamente, Ahora puedes iniciar sesión con "+this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', ''); 
        }

      },
      error =>{
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);

        }
      }
    );
  }
}
