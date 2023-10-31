import { DateTime } from "luxon";
import Timer from "../components/Timer";
import MusicPlayer from "../components/MusicPlayer/MusicPlayer";
import { useState, useCallback } from "react";
import {
  useSpotifyPlayer,
  WebPlaybackSDK,
} from "react-spotify-web-playback-sdk";
import gifImage from "../assets/images/cat_study.gif";
import { Button } from "@mui/joy";
import StopSeshModal from "../components/Sesh/StopSeshModal";
import { useSesh } from "../context/SeshContext";

const Sesh = () => {
  const [open, setOpen] = useState(false)
  const {seshState, dispatch} = useSesh()
  const [pause,setPause] = useState(seshState.isPaused)
  const toggleOpen = () => {
    setOpen(!open)
  } 

  const calculateTime = (expireDate) => {
    const date = DateTime.fromJSDate(expireDate);
    const now = DateTime.now();
    const diff = now.diff(date);
    return diff.as("seconds");
  };

  const [spotifyToken, setSpotifyToken] = useState(
    JSON.parse(localStorage.getItem("spotifyToken")!)
  );

  const getOAuthToken: Spotify.PlayerInit["getOAuthToken"] = useCallback(
    (callback) => {
      callback(spotifyToken.accessToken);
    },
    []
  );


  const togglePause = () => {
    //setPause(!pause)
    dispatch({type:'TOGGLE_PLAY', payload: !seshState.isPaused})
  }
  

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="top flex">
        <Timer />
        <img src={gifImage} alt="Animated GIF" style={{ width: "800px" }} />
      </div>
      <div className="middle flex gap-8">
       {seshState.isPaused ?   
        <Button onClick={togglePause}>Play session</Button>
        :
        <Button onClick={togglePause}>Pause session</Button>
       }
        <Button onClick={toggleOpen}>Stop session</Button>
      </div>
      <div className="bottom">
        <WebPlaybackSDK
          initialDeviceName="Pawmodoro"
          getOAuthToken={getOAuthToken}
          connectOnInitialized={true}
          initialVolume={0.5}
        >
          <MusicPlayer />
        </WebPlaybackSDK>
      </div>
      <StopSeshModal open={open} toggleOpen={toggleOpen}/>
    </div>
  );
};

export default Sesh;
