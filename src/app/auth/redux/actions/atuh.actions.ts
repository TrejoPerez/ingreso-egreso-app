import { Usuario } from './../../../models/usuario.model';
import { createAction, props } from '@ngrx/store';

export const setUser = createAction('[Counter Component] setUser',
    props<{ user: Usuario }>());

export const unSetUser = createAction('[Counter Component] unSetUser');
