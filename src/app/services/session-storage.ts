import { inject, Injectable, signal } from '@angular/core';
import { UserStorage } from './user-storage';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  isLoggedIn = signal<boolean>(
    !!sessionStorage.getItem('currentUser')
  );

  constructor(private userStorage: UserStorage) {}

  login(name: string, pwd: string): boolean {
    const usuario = this.userStorage.validateCredentials(name, pwd);
   
    if (!usuario) {
      return false;
    }

    const sesion = {
      id: usuario.id,
      name: usuario.name
    };

    sessionStorage.setItem('currentUser', JSON.stringify(sesion));

    this.isLoggedIn.set(true);

    return true;
  }

  getCurrentUser() {
    const sesion = sessionStorage.getItem('currentUser');
    return sesion ? JSON.parse(sesion) : null;
  }

  async logout(): Promise<void> {
  const resultado = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que deseas cerrar tu sesión?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  });

  if (!resultado.isConfirmed) {
    return;
  }

  sessionStorage.removeItem('currentUser');
  this.isLoggedIn.set(false);

  await Swal.fire({
    icon: 'success',
    title: 'Sesión cerrada',
    text: 'Has cerrado sesión correctamente.',
    timer: 1500,
    showConfirmButton: false
  });
}
}