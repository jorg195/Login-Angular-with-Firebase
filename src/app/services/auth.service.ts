import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';

  private apiKey = 'AIzaSyB12XcqguG56Nm3niXY3MBYnKxtfLI__W4';

  userToken: string;

  //Crear nuevos usuarios
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor(private http: HttpClient) { 
    //Lee si hay un token o no cuando se inicializa el servicio
    this.leerToken();
  }

  //Logout de usuarios (Salir)
  logout() {
    localStorage.removeItem('token');
  }

  //Login de usuarios (Entrar)
  login(usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      /*email: usuario.email,
      password: usuario.password,*/
      returnSecureToken: true
    };

    //Petición HTTP para mandar los datos al respectivo end point 
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp =>{
        //Filtra el token cuando un usuario hace login
        this.guardarToken(resp['idToken'])
        return resp;
      })
    );
  }

  //Crea un nuevo Usuario
  nuevoUsuario(usuario:UsuarioModel){

    const authData = {
      ...usuario,
      /*email: usuario.email,
      password: usuario.password,*/
      returnSecureToken: true
    };

    //Petición HTTP para mandar los datos al respectivo end point 
    return this.http.post(
      `${this.url}signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp =>{
        //Filtra el Token cuando se crea un usuario
        this.guardarToken(resp['idToken'])
        return resp;
      })
    );

  }

  //Guarda el token generado
  private guardarToken(idToken:string){

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    //Fecha en la que expira el token
    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira',hoy.getTime().toString())

  }

  leerToken(){

    //Si el token se existe se obtiene del local storage
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    
    //Si el token no existe se manda un string vacío
    }else{
      this.userToken = '';
    }

    return this.userToken;

  }

  estaAutenticado():boolean {

    //Retorna falso si el token tiene tamaño menor que 2
    if(this.userToken.length < 2){
      return false;
    }

    //Se obtiene la fecha de exp del token
    const expira = Number(localStorage.getItem('expira'))
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    //Regresa true si el tiempo de expiración todavía no se cumple y falso si ya se cumplió
    if(expiraDate > new Date()){
      return true;
    }else{
      return false;
    }
  }

}
