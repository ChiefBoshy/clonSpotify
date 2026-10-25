
import { TestBed } from '@angular/core/testing';
import { UserStorage } from './user-storage';
import { Usuario } from '../models/Usuario';

describe('UserStorage', () => {
  let service: UserStorage;

  const usuarios: Usuario[] = [
    { id: '1', name: 'Juan', pwd: '123456' },
    { id: '2', name: 'Maria', pwd: 'abcdef' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStorage]
    });

    service = TestBed.inject(UserStorage);

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
  });

  describe('getUsers', () => {
    it('debe devolver un arreglo vacío si no hay usuarios guardados', () => {
      expect(service.getUsers()).toEqual([]);
    });

    it('debe devolver los usuarios guardados', () => {
      (localStorage.getItem as jasmine.Spy)
        .and.returnValue(JSON.stringify(usuarios));

      expect(service.getUsers()).toEqual(usuarios);
    });

    it('debe devolver un arreglo vacío si el JSON es inválido', () => {
      (localStorage.getItem as jasmine.Spy)
        .and.returnValue('{json-invalido');

      expect(service.getUsers()).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('debe guardar los usuarios en localStorage', () => {
      service.saveUsers(usuarios);

      expect(localStorage.setItem).toHaveBeenCalledOnceWith(
        'users',
        JSON.stringify(usuarios)
      );
    });
  });

  describe('findByName', () => {
    beforeEach(() => {
      (localStorage.getItem as jasmine.Spy)
        .and.returnValue(JSON.stringify(usuarios));
    });

    it('debe encontrar un usuario por su nombre', () => {
      expect(service.findByName('Juan')).toEqual(usuarios[0]);
    });

    it('debe ignorar mayúsculas y minúsculas', () => {
      expect(service.findByName('JUAN')).toEqual(usuarios[0]);
    });

    it('debe ignorar espacios al inicio y al final', () => {
      expect(service.findByName('  Juan  ')).toEqual(usuarios[0]);
    });

    it('debe devolver undefined si el usuario no existe', () => {
      expect(service.findByName('Pedro')).toBeUndefined();
    });
  });

  describe('register', () => {
    it('debe registrar un usuario nuevo', () => {
      const resultado = service.register(' Pedro ', '123456');

      expect(resultado).toBeTrue();

      const llamada = (localStorage.setItem as jasmine.Spy)
        .calls.mostRecent();

      expect(llamada.args[0]).toBe('users');

      const usuariosGuardados = JSON.parse(llamada.args[1]);

      expect(usuariosGuardados.length).toBe(1);
      expect(usuariosGuardados[0].name).toBe('Pedro');
      expect(usuariosGuardados[0].pwd).toBe('123456');
      expect(usuariosGuardados[0].id).toBeTruthy();
    });

    it('debe guardar el nombre sin espacios al inicio ni al final', () => {
      service.register('  Pedro  ', '123456');

      const usuariosGuardados = JSON.parse(
        (localStorage.setItem as jasmine.Spy).calls.mostRecent().args[1]
      );

      expect(usuariosGuardados[0].name).toBe('Pedro');
    });

    it('no debe registrar un usuario con un nombre existente', () => {
      (localStorage.getItem as jasmine.Spy)
        .and.returnValue(JSON.stringify(usuarios));

      const resultado = service.register('Juan', 'otraClave');

      expect(resultado).toBeFalse();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('debe detectar nombres duplicados sin distinguir mayúsculas', () => {
      (localStorage.getItem as jasmine.Spy)
        .and.returnValue(JSON.stringify(usuarios));

      expect(service.register('JUAN', 'otraClave')).toBeFalse();
    });
  });

  describe('validateCredentials', () => {
    beforeEach(() => {
      (localStorage.getItem as jasmine.Spy)
        .and.returnValue(JSON.stringify(usuarios));
    });

    it('debe devolver el usuario si las credenciales son correctas', () => {
      expect(service.validateCredentials('Juan', '123456'))
        .toEqual(usuarios[0]);
    });

    it('debe devolver undefined si la contraseña es incorrecta', () => {
      expect(service.validateCredentials('Juan', 'incorrecta'))
        .toBeUndefined();
    });

    it('debe devolver undefined si el usuario no existe', () => {
      expect(service.validateCredentials('Pedro', '123456'))
        .toBeUndefined();
    });

    it('debe permitir buscar el usuario sin distinguir mayúsculas', () => {
      expect(service.validateCredentials('JUAN', '123456'))
        .toEqual(usuarios[0]);
    });
  });
});
