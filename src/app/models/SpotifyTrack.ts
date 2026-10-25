import { SpotifyArtist } from "./SpotifyArtist";
import { SpotifyAlbum } from "./SpotifyAlbum";


export interface SpotifyTrack {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}