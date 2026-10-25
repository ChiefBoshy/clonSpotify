
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { SpotifyApi } from './spotify-api';
import { SpotifySearchResponse } from '../models/SpotifySearchResponse';
import { environment } from '../../environments/environment';

describe('SpotifyApi', () => {
  let service: SpotifyApi;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpotifyApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SpotifyApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('search', () => {
    it('debe devolver las canciones buscadas por get', () => {
      const query = 'Radiohead';
      const type = 'track';

      service.search(query, type).subscribe();

      const req = httpMock.expectOne(
        request =>
          request.url === `${apiUrl}/search` &&
          request.params.get('q') === query &&
          request.params.get('type') === type
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('q')).toBe('Radiohead');
      expect(req.request.params.get('type')).toBe('track');

      req.flush({} as SpotifySearchResponse);
    });

    it('debe utilizar track como tipo predeterminado', () => {
      service.search('Muse').subscribe();

      const req = httpMock.expectOne(
        request => request.url === `${apiUrl}/search`
      );

      expect(req.request.params.get('q')).toBe('Muse');
      expect(req.request.params.get('type')).toBe('track');

      req.flush({} as SpotifySearchResponse);
    });

    it('debe permitir buscar artistas', () => {
      service.search('Daft Punk', 'artist').subscribe();

      const req = httpMock.expectOne(
        request => request.url === `${apiUrl}/search`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('q')).toBe('Daft Punk');
      expect(req.request.params.get('type')).toBe('artist');

      req.flush({} as SpotifySearchResponse);
    });

    it('debe devolver la respuesta recibida del backend', () => {
      const respuesta = {
        tracks: {
          items: [
            { id: 'track-1', name: 'Creep' }
          ]
        }
      } as unknown as SpotifySearchResponse;

      let resultado: SpotifySearchResponse | undefined;

      service.search('Radiohead').subscribe(data => {
        resultado = data;
      });

      const req = httpMock.expectOne(
        request => request.url === `${apiUrl}/search`
      );

      req.flush(respuesta);

      expect(resultado).toEqual(respuesta);
    });
  });

  describe('getHome', () => {
    it('debe realizar una petición GET al endpoint home', () => {
      service.getHome().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/home`);

      expect(req.request.method).toBe('GET');

      req.flush({});
    });

    it('debe devolver los datos recibidos del backend', () => {
      const respuesta = {
        tracks: {
          tracks: []
        },
        artists: {
          artists: []
        }
      } as unknown as Record<string, SpotifySearchResponse>;

      let resultado:
        Record<string, SpotifySearchResponse> | undefined;

      service.getHome().subscribe(data => {
        resultado = data;
      });

      const req = httpMock.expectOne(`${apiUrl}/home`);

      req.flush(respuesta);

      expect(resultado).toEqual(respuesta);
    });
  });
});
