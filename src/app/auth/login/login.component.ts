import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  login() {
    if (this.loginForm.invalid) { return; }
    this.loading();

    const { correo, password } = this.loginForm.value;

    this.auth.login(correo, password).then(() => {
      Swal.close();
      this.router.navigate(['/']);
    })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        });
      });
  }

  loading() {
    Swal.fire({
      title: 'Cargando',
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  }

}
