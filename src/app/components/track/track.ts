import { Component, input ,computed, inject} from '@angular/core';
import { SpotifyTrack } from '../../models/SpotifyTrack';
import { Router } from '@angular/router';
import { tableAnimation } from '../../animations/tableAnimation';
@Component({
  imports: [],
  animations:[tableAnimation],
  selector: 'app-track',
  styleUrl: './track.scss',
  templateUrl: './track.html',
})
export class Track {

  track = input.required<SpotifyTrack>();
  index = input<number | null>(null);
  router = inject(Router);

  readonly duration = computed(() => {
    const totalSeconds = Math.floor(
      this.track().duration_ms / 1000
    );

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  });

  readonly artists = computed(() =>
    this.track().artists
      .map((artist) => artist.name)
      .join(', ')
  );

  readonly cover = computed(() =>
    this.track().album.images?.[0]?.url ?? null
  );


  openTrack(): void {
  this.router.navigate(['/tracks', this.track().id], {
    state: {
      track: this.track(),
    },
  });
} 
}
