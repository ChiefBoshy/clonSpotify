
import { TestBed } from '@angular/core/testing';
import { UserStorage } from './user-storage';
import { SessionStorageService } from './session-storage';
import Swal from 'sweetalert2';
import { Usuario } from '../models/Usuario';

describe('SessionStorageService', () => {
  let service: SessionStorageService;
  let userStorageSpy: jasmine.SpyObj<UserStorage>;

  const usuario: Usuario = {
    id: '1',
    name: 'Juan',
    pwd: '123456'
  };

  beforeEach(() => {
    userStorageSpy = jasmine.createSpyObj<UserStorage>(
      'UserStorage',
      ['validateCredentials']
    );

    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    spyOn(sessionStorage, 'setItem');
    spyOn(sessionStorage, 'removeItem');

    TestBed.configureTestingModule({
      providers: [
        SessionStorageService,
        { provide: UserStorage, useValue: userStorageSpy }
      ]
    });

    service = TestBed.inject(SessionStorageService);
  });

  describe('isLoggedIn', () => {
    it('debe iniciar en false si no existe una sesión', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('debe iniciar en true si existe una sesión', () => {
      (sessionStorage.getItem as jasmine.Spy)
        .and.returnValue(JSON.stringify({
          id: usuario.id,
          name: usuario.name
        }));

      const nuevoServicio =
        new SessionStorageService(userStorageSpy);

      expect(nuevoServicio.isLoggedIn()).toBeTrue();
    });
  });

  describe('login', () => {
    it('debe iniciar sesión con credenciales válidas', () => {
      userStorageSpy.validateCredentials.and.returnValue(usuario);

      const resultado = service.login(
        usuario.name,
        usuario.pwd
      );

      expect(resultado).toBeTrue();

      expect(userStorageSpy.validateCredentials)
        .toHaveBeenCalledOnceWith(usuario.name, usuario.pwd);

      expect(sessionStorage.setItem).toHaveBeenCalledOnceWith(
        'currentUser',
        JSON.stringify({
          id: usuario.id,
          name: usuario.name
        })
      );

      expect(service.isLoggedIn()).toBeTrue();
    });

    it('debe devolver false con credenciales inválidas', () => {
      userStorageSpy.validateCredentials.and.returnValue(undefined);

      const resultado = service.login('Juan', 'incorrecta');

      expect(resultado).toBeFalse();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('getCurrentUser', () => {
    it('debe devolver los datos de la sesión', () => {
      const sesion = {
        id: usuario.id,
        name: usuario.name
      };

      (sessionStorage.getItem as jasmine.Spy)
        .and.returnValue(JSON.stringify(sesion));

      expect(service.getCurrentUser()).toEqual(sesion);
    });

    it('debe devolver null si no existe una sesión', () => {
      (sessionStorage.getItem as jasmine.Spy)
        .and.returnValue(null);

      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('logout', () => {
    it('no debe cerrar sesión si se cancela', async () => {
      spyOn(Swal, 'fire').and.resolveTo({
        isConfirmed: false
      } as any);

      service.isLoggedIn.set(true);

      await service.logout();

      expect(Swal.fire).toHaveBeenCalledTimes(1);
      expect(sessionStorage.removeItem).not.toHaveBeenCalled();
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('debe cerrar sesión si se confirma', async () => {
      spyOn(Swal, 'fire').and.returnValues(
        Promise.resolve({ isConfirmed: true } as any),
        Promise.resolve({ isConfirmed: true } as any)
      );

      service.isLoggedIn.set(true);

      await service.logout();

      expect(Swal.fire).toHaveBeenCalledTimes(2);
      expect(sessionStorage.removeItem)
        .toHaveBeenCalledOnceWith('currentUser');
      expect(service.isLoggedIn()).toBeFalse();
    });
  });
});
