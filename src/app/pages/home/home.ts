
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Table } from '../../components/table/table';
import { Track } from '../../components/track/track';
import { TrackDetail } from '../../components/track-detail/track-detail';
import { SpotifyTrack } from '../../models/SpotifyTrack';
import { SpotifyApi } from '../../services/spotify-api';
import { SpotifySearch } from '../../services/spotify-search';
import { Subscription , tap} from 'rxjs';
import { pageAnimation } from '../../animations/pageAnimation';
import { trackAnimation } from '../../animations/trackAnimation'; 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Table, Track, TrackDetail],
  animations:[trackAnimation],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private spotifyApi = inject(SpotifyApi);
  private cdr = inject(ChangeDetectorRef);


  private searchService = inject(SpotifySearch);
  private searchSubscription?: Subscription;
  private spotifySubscription?: Subscription;
  cantidadCanciones:number=0;

  canciones: SpotifyTrack[] = [];
  cargando = true;
  error = false;
ngOnInit(): void {
  this.searchSubscription = this.searchService.search$.subscribe(termino => {
    this.buscarCanciones(termino);
  });

  this.buscarCanciones('XXXTentacion');
}

private buscarCanciones(termino: string): void {
  this.cargando = true;
  this.error = false;

  this.spotifySubscription?.unsubscribe();

 this.spotifySubscription = this.spotifyApi
  .search(termino, 'track')
  .pipe(
    tap(response => {
      this.cantidadCanciones = response.tracks?.items?.length ?? 0;
    })
  )
  .subscribe({
    next: response => {
      this.canciones = response.tracks?.items ?? [];
      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: err => {
      console.error('Error al buscar canciones:', err);
      this.error = true;
      this.cargando = false;
      this.cdr.detectChanges();
    }
  });
}

ngOnDestroy(): void {
  this.searchSubscription?.unsubscribe();
  this.spotifySubscription?.unsubscribe();
}
}
