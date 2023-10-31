import {
  PauseCircle,
  PlayCircle,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import { Button, IconButton } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import {
  WebPlaybackSDK,
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";

const MusicPlayer = () => {
  //get token from useContext?
  const [spotifyToken, setSpotifyToken] = useState(
    JSON.parse(localStorage.getItem("spotifyToken")!)
  );

  const [playerLoaded, setPlayerLoaded] = useState(false);

  const player = useSpotifyPlayer();
  const playerDevice = usePlayerDevice();
  const [isPlaying, setIsPlaying] = useState(false);

  const getOAuthToken: Spotify.PlayerInit["getOAuthToken"] = useCallback(
    (callback) => {
      callback(spotifyToken.accessToken);
    },
    []
  );

  //1. check if websdk is ready
  //2. if websdk is ready then initialize player
  //3. display current playback state
  //4. on click play, player.play

  const PauseResumeButton = () => {
    const player = useSpotifyPlayer();

    if (player === null) return null;

    return (
      <div>
        <button onClick={() => player.pause()}>pause</button>
        <button onClick={() => player.resume()}>resume</button>
      </div>
    );
  };

  const playMusic = () => {};

  const SongTitle: React.FC = () => {
    const playbackState = usePlaybackState();
    console.log("test", playbackState);
    if (playbackState === null) return null;
    console.log(
      "Playback state: " + playbackState.track_window.current_track.name
    );
    //update song name
    //update artist name
    return `Current song: ${playbackState.track_window.current_track.name}`;
  };

  //   useEffect(() => {
  //     const spotifyTokenStr = localStorage.getItem("spotifyToken")
  //     if (spotifyTokenStr) {
  //       setSpotifyToken(JSON.parse(spotifyTokenStr));
  //     }
  //   }, []);

  const clickPlay = () => {
    player!.resume();
    setIsPlaying(true);
  };

  const clickPause = () => {
    player!.pause();
    setIsPlaying(false);
  };

  //get currently selected music track
  const getSelectedMusicTrack = () => {
    return JSON.parse(localStorage.getItem("sesh")!).bgm.uri;
  };

  const startPlayback = async () => {
    console.log("2");
    if (playerDevice?.device_id === undefined) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        body: JSON.stringify({
          device_ids: [playerDevice.device_id],
          context_uri: getSelectedMusicTrack(),
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyToken.accessToken}`,
        },
      }).then((response) => {
        console.log("response 106: ", response);
        setPlayerLoaded(true);
        clickPlay();
      });
    } catch (e) {
      console.log(e);
    }
  };

  const transferPlayback = async () => {
    if (playerDevice?.device_id === undefined) return;
    //transfer playback
    // https://developer.spotify.com/documentation/web-api/reference/#endpoint-transfer-a-users-playback
    try {
      await fetch(`https://api.spotify.com/v1/me/player`, {
        method: "PUT",
        body: JSON.stringify({
          device_ids: [playerDevice.device_id],
          play: false,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyToken.accessToken}`,
        },
      });
      // After the first request completes, set playerLoaded to true
    } catch (error) {
      console.error("Error transferring playback:", error);
    }
  };

  const playNext = async () => {
    if (playerDevice?.device_id === undefined) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/next`, {
        method: "POST",
        body: JSON.stringify({
          device_id: playerDevice.device_id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyToken.accessToken}`,
        },
      });
      // After the first request completes, set playerLoaded to true
    } catch (error) {
      console.error("Error playing next song: ", error);
    }
  };

  const playPrev = async () => {
    if (playerDevice?.device_id === undefined) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/previous`, {
        method: "POST",
        body: JSON.stringify({
          device_id: playerDevice.device_id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyToken.accessToken}`,
        },
      });
      // After the first request completes, set playerLoaded to true
    } catch (error) {
      console.error("Error playing next song: ", error);
    }
  };

  const setupPlayer = async () => {
    await transferPlayback();
    setTimeout(async () => {
      await startPlayback();
    }, 3000);
  };

  useEffect(() => {
    setupPlayer();
    // if (playerDevice?.device_id === undefined) return;
    // //transfer playback
    // // https://developer.spotify.com/documentation/web-api/reference/#endpoint-transfer-a-users-playback
    // fetch(`https://api.spotify.com/v1/me/player`, {
    //   method: "PUT",
    //   body: JSON.stringify({
    //     device_ids: [playerDevice.device_id],
    //     play: false,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${spotifyToken.accessToken}`,
    //   },
    // })
    //setPlayerLoaded(true);
    // fetch(`https://api.spotify.com/v1/me/player/play`, {
    //     method: "PUT",
    //     body: JSON.stringify({
    //       device_ids: [playerDevice.device_id],
    //       context_uri: getSelectedMusicTrack(),
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${spotifyToken.accessToken}`,
    //     },

    // })
  }, [playerDevice?.device_id]);

  // useEffect(() => {
  //   if (playerLoaded) {
  //     //play correct thing
  //     console.log('test')
  //     if (playerDevice?.device_id === undefined) return;

  //     fetch(`https://api.spotify.com/v1/me/player/play`, {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         device_ids: [playerDevice.device_id],
  //         context_uri: getSelectedMusicTrack(),
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${spotifyToken.accessToken}`,
  //       },
  //     });
  //   }
  // }, [playerLoaded]);

  // useEffect(() => {
  //   if (playerDevice?.device_id === undefined) return;

  //   // First fetch request: Transfer playback
  //   const transferPlayback = async () => {
  //     try {
  //       await fetch(`https://api.spotify.com/v1/me/player`, {
  //         method: "PUT",
  //         body: JSON.stringify({
  //           device_ids: [playerDevice.device_id],
  //           play: false,
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${spotifyToken.accessToken}`,
  //         },
  //       });
  //       // After the first request completes, set playerLoaded to true
  //       setPlayerLoaded(true);
  //     } catch (error) {
  //       console.error("Error transferring playback:", error);
  //     }
  //   };
  //   transferPlayback();
  // }, [playerDevice?.device_id, spotifyToken.accessToken]);

  // useEffect(() => {
  //   if (playerLoaded) {
  //     // Second fetch request: Play music
  //     const playMusic = async () => {
  //       try {
  //         if (playerDevice?.device_id === undefined) return;
  //         await fetch(`https://api.spotify.com/v1/me/player/play`, {
  //           method: "PUT",
  //           body: JSON.stringify({
  //             device_ids: [playerDevice.device_id],
  //             context_uri: getSelectedMusicTrack(),
  //           }),
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${spotifyToken.accessToken}`,
  //           },
  //         });
  //       } catch (error) {
  //         console.error("Error playing music:", error);
  //       }
  //     };

  //     playMusic();
  //   }
  // }, [playerLoaded, getSelectedMusicTrack, playerDevice?.device_id, spotifyToken.accessToken]);

  return (
    <>
      {playerLoaded && (
        <div className="player flex-col items-center justify-center bg-slate-200 p-4 rounded-md m-8" style={{width:"75vw"}}>
          <div className="player-song-title w-1200 flex flex-col">
            <p>
              <SongTitle />
            </p>
            <span>Artist Name</span>
          </div>
          <div className="flex items-center justify-center">
            <IconButton className="btn-prev" onClick={playPrev}>
              <SkipPrevious sx={{ fontSize: "3em" }} />
            </IconButton>
            {!isPlaying ? (
              <IconButton className="btn-play text-4xl" onClick={clickPlay}>
                <PlayCircle sx={{ fontSize: "3em" }} />
              </IconButton>
            ) : (
              <IconButton className="btn-play text-4xl" onClick={clickPause}>
                <PauseCircle sx={{ fontSize: "3em" }} />
              </IconButton>
            )}
            <IconButton className="btn-next" onClick={playNext}>
              <SkipNext sx={{ fontSize: "3em" }} />
            </IconButton>
          </div>
        </div>
      )}
      {/* <PlayerContent access_token={token.access_token} /> */}
    </>
  );
};

export default MusicPlayer;
