import {
  computed,
  Component,
  signal,
  OnInit,
  inject,
} from '@angular/core';

import { Router } from '@angular/router';
import { SpotifyTrack } from '../../models/SpotifyTrack';
import { CommonModule } from '@angular/common';
import { Track } from '../track/track';

@Component({
  imports: [CommonModule,Track],
  selector: 'app-track-detail',
  styleUrl: './track-detail.scss',
  templateUrl: './track-detail.html',
})
export class TrackDetail implements OnInit {
  private readonly router = inject(Router);

  readonly track = signal<SpotifyTrack | null>(null);

  readonly duration = computed(() => {
    const track = this.track();
    if (!track) return '';

    const totalSeconds = Math.floor(track.duration_ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  });

  readonly artists = computed(() =>
    this.track()?.artists.map(artist => artist.name).join(', ') ?? ''
  );

  readonly cover = computed(() =>
    this.track()?.album.images?.[0]?.url ?? null
  );

  ngOnInit(): void {
    const track = this.router.currentNavigation()?.extras.state?.['track']
      ?? history.state?.track;

    if (track) {
      this.track.set(track as SpotifyTrack);
    }
  }
}