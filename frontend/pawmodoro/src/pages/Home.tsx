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

const Home = () => {
  const { seshState, dispatch } = useSesh();
  const [seshStatus, setSeshStatus] = useState();
  const [session, setSession] = useState({} as Sesh);

  const navigate = useNavigate();

  const createNewSession = async (formData:HTMLFormElement) => {
    //convertToDateTime(session.sessionDuration!);
    //console.log("session", JSON.stringify(formData,null,2))
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
        tasks: []
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
      key === "sessionDuration" ? formDataObject[key] = value * 60 : formDataObject[key] = value
    });
    //create new session
    createNewSession(formDataObject);
    //move to new page
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

  return (
    <div className="flex flex-col">
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
          <FormControl>
            <FormLabel>Select music to listen to...</FormLabel>
            <Autocomplete
              name="bgm"
              options={["test"]}
              placeholder="Select music"
              sx={{ width: 300 }}
            />
          </FormControl>

          <Button type="submit">Create new session</Button>
        </form>
      </main>
    </div>
  );
};

export default Home;
