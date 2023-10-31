import axios from "axios";
import { useState, useEffect } from "react";
import { SPOTIFY_PLAYLISTS_ENDPOINT } from "../../common/constants";
import { FormControl, FormLabel, Autocomplete, AutocompleteOption, ListItemDecorator, ListItemContent, Typography } from "@mui/joy";
import { isEmpty } from "lodash";
import { useSesh } from "../../context/SeshContext";

const UserInfo = ({spotifyToken, playlists, setPlaylists}) => {
  //get user image
  //get user current playlist
  //select playlist
  //const [spotifyToken, setSpotifyToken] = useState({})

//   useEffect(() => {
//     const spotifyTokenStr = localStorage.getItem("spotifyToken");
//     //console.log(spotifyTokenStr)
//     if (spotifyTokenStr) {
//       setSpotifyToken(JSON.parse(spotifyTokenStr));
//     }
//   }, []);

  useEffect(() => {
    if(!isEmpty(spotifyToken)) getPlaylists()
   // console.log("test")
  }, [spotifyToken])

  //get list of playlists
  //response.data.items => item.id , item.name, item.uri
  //const [playlists, setPlaylists] = useState([]);
  const getPlaylists = () => {
    //console.log("spotifytoken ", spotifyToken)
    //console.log("accesstoken ", spotifyToken.accessToken)
    axios
      //.get(`${SPOTIFY_PLAYLISTS_ENDPOINT}/currently-playing`, {
      .get(`https://api.spotify.com/v1/me/playlists`, {
        headers: {
          Authorization: "Bearer " + spotifyToken.accessToken,
        },
      })
      .then((response) => {
        //setData(response.data);
        const playlistsData = response.data.items.map((item) => {
          const playlistItem = {
            id: item.id,
            name: item.name,
            uri: item.uri,
          };
          return playlistItem;
        });
        setPlaylists(playlistsData);
        //console.log(JSON.stringify(response.data, null, 2));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
      <FormControl>
        <FormLabel>Select music to listen to...</FormLabel>
        <Autocomplete
          name="bgm"
          options={playlists}
          getOptionLabel={option => option.name}
        //   renderOption={(props, option) => (
        //     <AutocompleteOption {...props}>
        //       <ListItemContent sx={{ fontSize: 'sm' }}>
        //         {option.name}
        //         {option.uri}
        //         {option.id}
        //       </ListItemContent>
        //     </AutocompleteOption>
        // )}
          placeholder="Select music"
          sx={{ width: 300 }}
        />
      </FormControl>
  );
};

export default UserInfo;
