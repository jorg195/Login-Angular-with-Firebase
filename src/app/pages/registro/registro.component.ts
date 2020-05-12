import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  //Instancia del Usuario
  usuario: UsuarioModel;
  recordarme = false;

  constructor(private auth:AuthService,
              private router:Router) { }

  ngOnInit() { 

    this.usuario = new UsuarioModel();

  }

  onSubmit(form:NgForm){

    //Si el formulario es invalido no retorna nada
    if(form.invalid){return;}

    //Si el formulario es invalido no retorna nada
    Swal.fire({

      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'

    })
    //Muestra la carga mientras se carga la respuesta
    Swal.showLoading();

    //Petición para crear un nuevo usuario con base a los datos que hay en el formulario
    this.auth.nuevoUsuario(this.usuario).subscribe( resp => {

      console.log(resp);
      //Se cierra la alerta
      Swal.close();

      //Recuerda el usuario si el checkbox está marcado
      if(this.recordarme){
        localStorage.setItem('email', this.usuario.email)
      }

      //Navega hacía la ruta home
      this.router.navigateByUrl('/home');
      
    //Manejo de Errores  
    }, (err) => {
      
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
