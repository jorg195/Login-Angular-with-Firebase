import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Instancia del Usuario
  usuario: UsuarioModel;
  recordarme = true;

  constructor(private auth:AuthService,
              private router:Router) { }

  ngOnInit() {

    this.usuario = new UsuarioModel();

    //Si existe un email en el localstorage se obtiene para recordar el usuario y mostrar el email en el campo
    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }

  }

  login(form:NgForm){

    //Si el formulario es invalido no retorna nada
    if(form.invalid){return;}

    //Alerta
    Swal.fire({

      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'

    })

    //Muestra la carga mientras se carga la respuesta
    Swal.showLoading();

    //Subscripción para login
    this.auth.login(this.usuario).subscribe(resp => {

      console.log(resp);
      //Se cierra la alerta
      Swal.close();

      //Recuerda el usuario si el checkbox está marcado
      if(this.recordarme){
        localStorage.setItem('email', this.usuario.email)
      }

      //Navega hacía la ruta home
      this.router.navigateByUrl('/home');

    //Manejo de errores
    }, (err) =>{

      console.log(err.error.error.message);
      //Muestra el error
      Swal.fire({

        icon: 'error',
        title: 'Error al autenticar',
        text: err.error.error.message
  
      })
      
    })

  }

}
