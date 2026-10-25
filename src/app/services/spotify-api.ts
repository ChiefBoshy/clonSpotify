import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifySearchResponse } from '../models/SpotifySearchResponse';
import { environment } from '../../environments/environment';

@Service()
export class SpotifyApi {
private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  search(query: string,type: string = 'track'): Observable<SpotifySearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', type);

    return this.http.get<SpotifySearchResponse>(
      `${this.apiUrl}/search`,
      { params }
    );
  }

  getHome(): Observable<Record<string, SpotifySearchResponse>> {
    return this.http.get<Record<string, SpotifySearchResponse>>(
      `${this.apiUrl}/home`
    );
  }

}
