
import { SpotifyTrack } from './SpotifyTrack';

export interface SpotifySearchResponse {
  tracks?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyTrack[];
  };
}
