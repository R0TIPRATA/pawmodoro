import { useEffect, useState, useRef } from "react";
import { useSesh } from "../context/SeshContext";
import { useNavigate } from "react-router-dom";
import { Sesh } from "../types";
import { DateTime } from "luxon";

const Timer = () => {
  const { seshState, dispatch } = useSesh();
  const INTERVAL = 1000;
  const navigate = useNavigate();
  const [timeDisplay, setTimeDisplay] = useState("00:00");
  const [status, setStatus] = useState("resumed");

  let expected = Date.now() + INTERVAL;
  const timeoutRef = useRef(null);

  const start = () => {
    if (timeRemaining == 0) return;
    timeoutRef.current = setTimeout(step, 1000);
    expected = Date.now() + INTERVAL;
    setStatus("resumed");
  };

  const stop = () => {
    clearTimeout(timeoutRef.current);
    setStatus("paused");
    
  };

  const step = () => {
    const drift = Date.now() - expected; // the drift (positive for overshooting)
    setTimeRemaining((prevTime) => {
      const newTime = prevTime - 1;
      setTimeDisplay(updateTimeDisplay(newTime));
      return newTime;
    });
    expected = expected + INTERVAL;
    if (drift < INTERVAL) {
      timeoutRef.current = setTimeout(step, Math.max(0, INTERVAL - drift));
    } else {
      console.log(
        "something happened to cause the drift to exceed the interval"
      );
      timeoutRef.current = setTimeout(step, 1000);
    }
  };

  const updateTimeDisplay = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);

    return (
      (minutes > 9 ? minutes : "0" + minutes) +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds)
    );
  };

  const updateSessionStatus = async() => {
    console.log("running update session")
    const dataForm = {
      status: "completed",
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/sesh/${seshState.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataForm),
        }
      );
      const data = await response.json();
      const res = {
        id: data.id,
        createdAt: data.created_at,
        sessionDuration : data.session_duration,
        status: data.status,
        expiresIn: data.expires_in,
        //tasks
      }
      dispatch({ type: "UPDATE_SESSION", payload: res });
      navigate("/tasklist/update");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //on load, set duration as endDate time 
  //if click pause button, setInterval is removed
  //if click pause button, save paused date time, save time remaining (it's there alr?)
  //if click pause button, update status of session to become paused
  //if session is paused, onload, timer will be paused
  //on click resume, update database to change endDate time (timenow + duration left)
  const onClickPause = () => {
    if (timeoutRef.current && status === "resumed") stop();
  };
  
  //
  const onClickResume = () => {
    if (timeoutRef.current && status === "paused") start();
  };

  //If the use context sesh state is empty, call API to check remaining time (expiresIn at the end of the session)
  
  const calculateTimeRemaining = (expireDate:DateTime) => {
    //console.log('expire date time: ', expireDate);
    const now = DateTime.now();
    const diff = expireDate.diff(now);
    return diff.as("seconds")
  }

  const init = () => {
    //get end time
    if(seshState){
      const expireDateTime = DateTime.fromJSDate(seshState.expiresIn!)
      const duration = calculateTimeRemaining(expireDateTime)
      setTimeRemaining(duration)
      setTimeDisplay(updateTimeDisplay(duration))
    }
  }
  const getDuration = () => {
    if(seshState){
      const expireDateTime = DateTime.fromJSDate(seshState.expiresIn!)
      const duration = calculateTimeRemaining(expireDateTime)
      return duration;
    }
  }

  const [timeRemaining, setTimeRemaining] = useState<number>();

  useEffect(() => {
    init() //rename pls
    start();
    //setTimeDisplay(updateTimeDisplay(seshState.sessionDuration));
  }, []);

  // useEffect(() => {
  //   setTimeRemaining(calculatedTimeLeft);
  //   console.log("time remaining: ", calculatedTimeLeft)
  // }, [calculatedTimeLeft]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      stop()
      updateSessionStatus()
      //navigate("/tasklist/update");
      //localStorage.removeItem("sesh");
    }
  }, [timeRemaining]);


  return (
    <div className="timer-test">
      <div className="circle-timer"></div>
      {timeDisplay} <br></br>
      {timeRemaining} <br></br>
      <button onClick={onClickResume}>Resume</button>
      <button onClick={onClickPause}>Pause</button>
      <button>Stop</button>
    </div>
  );
};

export default Timer;
