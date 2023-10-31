import { useEffect, useState, useRef } from "react";
import { useSesh } from "../context/SeshContext";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const Timer = () => {
  const { seshState, dispatch } = useSesh();
  const INTERVAL = 1000;
  const RESUMED = "resumed";
  const PAUSED = "paused";
  const navigate = useNavigate();
  const [timeDisplay, setTimeDisplay] = useState("00:00");
  const [status, setStatus] = useState(RESUMED);

  let expected = Date.now() + INTERVAL;
  const timeoutRef = useRef(null);

  const start = () => {
    if (timeRemaining == 0) return;
    timeoutRef.current = setTimeout(step, 1000);
    expected = Date.now() + INTERVAL;
    setStatus(RESUMED);
  };

  const stop = () => {
    clearTimeout(timeoutRef.current);
    setStatus(PAUSED);
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

  const updateSessionStatus = async () => {
    console.log("running update session");
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
        sessionDuration: data.session_duration,
        status: data.status,
        expiresIn: data.expires_in,
        //tasks
      };
      dispatch({ type: "UPDATE_SESSION", payload: res });
      navigate("/tasklist/update");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const calculateTimeRemaining = (expireDate: DateTime) => {
    const now = DateTime.now()
    const diff = expireDate.diff(now)
    const diffInSeconds = diff.as("seconds")
    return diffInSeconds < 0 ? 0 : diffInSeconds
  };

  const init = () => {
    if (seshState) {
      const expireDateTime = DateTime.fromJSDate(seshState.expiresIn!);
      const duration = calculateTimeRemaining(expireDateTime);
      setTimeRemaining(duration);
      setTimeDisplay(updateTimeDisplay(duration));
    }
  };

  const getDuration = (expiryDate:Date) => {
      const expireDateTime = DateTime.fromJSDate(expiryDate);
      const duration = calculateTimeRemaining(expireDateTime);
      return duration;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(getDuration(seshState.expiresIn!)!);

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
      console.log("something happened to cause the drift to exceed the interval");
      //reload time remaining
      setTimeRemaining(getDuration(new Date())!)
    }
  };

  useEffect(() => {
    init(); 
  }, [seshState.id]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      stop();
      updateSessionStatus();
    }
  }, [timeRemaining]);

  useEffect(() => {
    seshState.isPaused ? stop() : start()
  }, [seshState.isPaused]);

  return (
    <div className="flex flex-col timer-test justify-center items-center">
      <div className="timebox">
        <CountdownCircleTimer
          isPlaying = {!seshState.isPaused}
          size={120}
          duration= {JSON.parse(localStorage.getItem("sesh")!).sessionDuration!}
          initialRemainingTime={timeRemaining!}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
        ></CountdownCircleTimer>
      </div>
      {timeDisplay} <br></br>
    </div>
  );
};

export default Timer;
