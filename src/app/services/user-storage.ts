import { Service } from '@angular/core';
import { Usuario } from '../models/Usuario';
@Service()
export class UserStorage {
     private readonly storageKey = 'users';

  getUsers(): Usuario[] {
    const data = localStorage.getItem(this.storageKey);

    if (!data) return [];

    try {
      return JSON.parse(data) as Usuario[];
    } catch {
      return [];
    }
  }

  saveUsers(users: Usuario[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  findByName(name: string): Usuario | undefined {
    return this.getUsers().find(
      usuario => usuario.name.toLowerCase() === name.trim().toLowerCase()
    );
  }

  register(name: string, pwd: string): boolean {
    if (this.findByName(name)) return false;

    const usuarios = this.getUsers();

    const nuevoUsuario: Usuario = {
      id: crypto.randomUUID(),
      name: name.trim(),
      pwd
    };

    usuarios.push(nuevoUsuario);
    this.saveUsers(usuarios);

    return true;
  }

  validateCredentials(name: string, pwd: string): Usuario | undefined {
    const usuario = this.findByName(name);

    return usuario && usuario.pwd === pwd
      ? usuario
      : undefined;
  }
}
