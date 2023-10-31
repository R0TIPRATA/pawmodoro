import { useNavigate } from "react-router-dom";
import catImage from "../assets/images/home_cat.png";
import titleImage from "../assets/images/title.png";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Autocomplete,
} from "@mui/joy";
import { DateTime, Duration } from "luxon";
import { useContext, useEffect, useRef, useState } from "react";
import { useSesh } from "../context/SeshContext";
import { Sesh } from "../types";
import { SPOTIFY_AUTHORIZE_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPES } from "../common/constants";
import UserInfo from "../components/MusicPlayer/UserInfo";

const Home = () => {
  const { seshState, dispatch } = useSesh();
  const [seshStatus, setSeshStatus] = useState();
  const [spotifyToken, setSpotifyToken] = useState()
  const [playlists, setPlaylists] = useState([]);
  const [session, setSession] = useState({} as Sesh);

  const navigate = useNavigate();

  const createNewSession = async (formData:HTMLFormElement) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/sesh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_duration: formData.sessionDuration,
            expires_in: new Date, //update expires_in later
            status: "pending"
          }),
        }
      );
      const data = await response.json();
      const res:Sesh = {
        id: data.id,
        createdAt: data.created_at,
        sessionDuration : data.session_duration,
        status: data.status,
        expiresIn: {} as Date,
        tasks: [],
        bgm: formData.bgm
      }
      setSession(res);
      //to add:DISPATCH UPDATE NEW SESSION
      dispatch({ type: "UPDATE_SESSION", payload: res });
      navigate("/tasklist/create");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formDataObject = {} as any;
    formData.forEach((value, key) => {
      if(key === "sessionDuration"){
        formDataObject[key] = value * 60;
      }else if (key === "bgm" ){
        formDataObject[key] = playlists.find(playlist => playlist.name === value) || null;
      }else{
        formDataObject[key] = value
      }
    });
    console.log('formData => ', JSON.stringify(formDataObject))
    //create new session
    createNewSession(formDataObject);
  };

  const loginSpotify = () => {
    //log into spotify
    console.log("spotify client id => ", SPOTIFY_CLIENT_ID)
    window.location.replace(`${SPOTIFY_AUTHORIZE_URL}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${SPOTIFY_SCOPES}&response_type=token&show_dialog=true`);
  }

  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulator:any, currentValue:any) => {
      const [key, value] = currentValue.split("=");
      accumulator[key] = value; 
      return accumulator;
    }, {});
  
    return paramsSplitUp;
  };

  useEffect(() => {
    //if session is ongoing, get the end of time
    //calculate difference between end time and now
    //set the timer correctly
    const localSeshInString = localStorage.getItem("sesh")

    //if local sesh exists
    if(localSeshInString){
      const localSesh = JSON.parse(localSeshInString)
      // //check state
      // console.log("localSesh: ", localSesh)
      // console.log("localSesh: ", JSON.stringify(localSesh, null, 2))
      if(localSesh.status === "ongoing"){
        console.log("you shouldn't be here! redirecting to session!")
        navigate("/sesh")
      }
    }

    //else if localSession has been cleared
    //or no existing localSession at all
    //then do what?

    // console.log("seshstate => ", seshState);
    // if (seshState && seshState.status === "ongoing") {
    //   console.log("You shouldn't be here. Redirecting to session page...");
    //   navigate("/sesh")
    // } else if (
    //   seshState &&
    //   (seshState.status === "terminated" || seshState.status === "completed")
    // ) {
    //   console.log("You shouldn't be here. Redirecting to home page...");
    // } else {
    //   console.log("all good!");
    // }
    // let timeout = 0;
    // if (isEmpty(seshState.id)) {
    //   timeout = setTimeout(() => {
    //     getSesh();
    //   }, 1000);
    // }
    // return () => {
    //   clearTimeout(timeout);
    // };
  }, [seshStatus]);

  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
      
      const spotifyToken = {
        accessToken: access_token,
        tokenType: token_type,
        expiresIn: expires_in, 
      }

      localStorage.setItem("spotifyToken", JSON.stringify(spotifyToken));
  }},[window.location.hash])

  useEffect(() => {
    const spotifyTokenStr = localStorage.getItem("spotifyToken")
    if (spotifyTokenStr) {
      setSpotifyToken(JSON.parse(spotifyTokenStr));
    }
    //check if spotify token is valid
    //if not valid, clear local storage cache
  }, []);

  return (
    <div className="flex flex-col min-w-screen min-h-screen items-center justify-center gap-8">
      <div>
        <img src={titleImage} style={{ maxWidth: 400 }} />
      </div>
      <main className="flex">
        <div className="home-cat-image-wrapper">
          <img src={catImage} style={{ maxWidth: 400 }} />
        </div>
        <form className="form flex flex-col gap-y-2" onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>I will accompany you for...</FormLabel>
            <Input
              type="number"
              defaultValue={45}
              slotProps={{
                input: {
                  min: 1,
                  max: 60,
                },
              }}
              name="sessionDuration"
              endDecorator="min"
              required
            />
          </FormControl>
          {spotifyToken ? 
            <UserInfo spotifyToken={spotifyToken} playlists={playlists} setPlaylists={setPlaylists}/>
            : 
            <div>
              <p>Add music to your session</p>
              <Button onClick={loginSpotify}>Login to spotify</Button> 
            </div>
          }
          
          <Button type="submit">Create new session</Button>
        </form>
      </main>
    </div>
  );
};

export default Home;
