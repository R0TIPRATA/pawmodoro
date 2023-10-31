
  export const SPOTIFY_SCOPES = [
    "ugc-image-upload",
    "user-read-recently-played",
    "user-top-read",
    "user-read-playback-position",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "app-remote-control",
    "streaming",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-follow-modify",
    "user-follow-read",
    "user-library-modify",
    "user-library-read",
    "user-read-email",
    "user-read-private",
  ] as const;

  
  export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  
  export const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  
  export const SPOTIFY_REDIRECT_URI =`http://localhost:3000`;
  
  export const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
  
  export const SPOTIFY_API_TOKEN_URL = "https://accounts.spotify.com/api/token";

  export const SPOTIFY_PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";


  export const SESH_STATUS = {
    PENDING: "pending",
    ONGOING: "ongoing",
    COMPLETED: "completed",
    TERMINATED: "terminated"
  }