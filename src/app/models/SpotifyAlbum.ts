
import { SpotifyArtist } from "./SpotifyArtist";

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: {
    url: string;
    height?: number | null;
    width?: number | null;
  }[];
  artists?: SpotifyArtist[];
  release_date?: string;
  external_urls?: {
    spotify: string;
  };
}