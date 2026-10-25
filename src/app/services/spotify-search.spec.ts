
import { TestBed } from '@angular/core/testing';
import { SpotifySearch } from './spotify-search';

describe('SpotifySearch', () => {
  let service: SpotifySearch;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpotifySearch]
    });

    service = TestBed.inject(SpotifySearch);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('buscar', () => {
    it('debe emitir el término de búsqueda', () => {
      const termino = 'Radiohead';
      let resultado = '';

      service.search$.subscribe(valor => {
        resultado = valor;
      });

      service.buscar(termino);

      expect(resultado).toBe(termino);
    });

    it('debe emitir varios términos en orden', () => {
      const resultados: string[] = [];

      service.search$.subscribe(valor => {
        resultados.push(valor);
      });

      service.buscar('Radiohead');
      service.buscar('Muse');
      service.buscar('Daft Punk');

      expect(resultados).toEqual([
        'Radiohead',
        'Muse',
        'Daft Punk'
      ]);
    });

    it('debe permitir emitir una cadena vacía', () => {
      let resultado: string | undefined;

      service.search$.subscribe(valor => {
        resultado = valor;
      });

      service.buscar('');

      expect(resultado).toBe('');
    });

    it('no debe emitir valores antes de llamar a buscar', () => {
      const resultados: string[] = [];

      service.search$.subscribe(valor => {
        resultados.push(valor);
      });

      expect(resultados).toEqual([]);
    });
  });

  describe('search$', () => {
    it('debe permitir suscribirse al observable', () => {
      expect(service.search$.subscribe).toBeDefined();
    });

    it('debe emitir a los suscriptores activos', () => {
      const primerSuscriptor = jasmine.createSpy('primerSuscriptor');
      const segundoSuscriptor = jasmine.createSpy('segundoSuscriptor');

      service.search$.subscribe(primerSuscriptor);
      service.search$.subscribe(segundoSuscriptor);

      service.buscar('Queen');

      expect(primerSuscriptor).toHaveBeenCalledOnceWith('Queen');
      expect(segundoSuscriptor).toHaveBeenCalledOnceWith('Queen');
    });
  });
});
