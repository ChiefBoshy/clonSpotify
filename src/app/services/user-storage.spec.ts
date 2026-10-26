
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

  it('debe devolver un arreglo vacio si no hay usuarios', () => {
    expect(service.getUsers()).toEqual([]);
  });

  it('debe guardar los usuarios en localStorage', () => {
    service.saveUsers(usuarios);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'users',
      JSON.stringify(usuarios)
    );
  });

  it('debe encontrar un usuario por su nombre', () => {
    (localStorage.getItem as jasmine.Spy)
      .and.returnValue(JSON.stringify(usuarios));

    expect(service.findByName('Juan')).toEqual(usuarios[0]);
  });

  it('debe registrar un usuario nuevo', () => {
    const resultado = service.register('Pedro', '123456');

    expect(resultado).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('no debe registrar un usuario que ya existe', () => {
    (localStorage.getItem as jasmine.Spy)
      .and.returnValue(JSON.stringify(usuarios));

    expect(service.register('Juan', 'otraClave')).toBeFalse();
  });

  it('debe validar credenciales correctas', () => {
    (localStorage.getItem as jasmine.Spy)
      .and.returnValue(JSON.stringify(usuarios));

    expect(service.validateCredentials('Juan', '123456'))
      .toEqual(usuarios[0]);
  });

  it('debe rechazar credenciales incorrectas', () => {
    (localStorage.getItem as jasmine.Spy)
      .and.returnValue(JSON.stringify(usuarios));

    expect(service.validateCredentials('Juan', 'incorrecta'))
      .toBeUndefined();
  });
});
