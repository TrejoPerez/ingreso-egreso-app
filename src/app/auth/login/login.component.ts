import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import * as ui from '../../shared//redux/actions/ui.actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  cargando = false;
  uiSubscription: Subscription;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,
    private store: Store<AppState>) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.uiSubscription = this.store.select('ui').subscribe(uis => {
      this.cargando = uis.isLoading;
    });
  }
  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }
  login() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());

    const { correo, password } = this.loginForm.value;

    this.auth.login(correo, password).then((data: any) => {
      // Swal.close();
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    })
      .catch(err => {
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
