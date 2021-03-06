import * as authActions from './../../auth/redux/actions/atuh.actions';
import { Store } from '@ngrx/store';
import { Usuario } from './../../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubscription: Subscription;
  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }
  crearUsuario(nombre: string, email: string, password: string): Promise<void> {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }
  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  logout(): Promise<void> {
    return this.auth.signOut();
  }
  isAuth() {
    return this.auth.authState.pipe(map(fbUser => fbUser !== null));
  }
}
