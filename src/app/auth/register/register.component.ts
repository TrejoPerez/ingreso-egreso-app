import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared//redux/actions/ui.actions';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  uiSubscription: Subscription;
  cargando = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.uiSubscription = this.store.select('ui').subscribe(uis => this.cargando = uis.isLoading);

  }
  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }
  crearUsuario() {
    if (this.registroForm.invalid) { return; }
    this.store.dispatch(ui.isLoading());


    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password).then(() => {
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    }).catch(err => {
      this.store.dispatch(ui.stopLoading());
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
