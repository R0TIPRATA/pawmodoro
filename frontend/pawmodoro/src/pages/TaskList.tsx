import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSesh } from "../context/SeshContext";
import CreateTaskForm from "../components/CreateTaskForm";
import UpdateTaskForm from "../components/UpdateTaskForm";
import backgroundImage from "../assets/images/tasks_bg.png"
const CREATE_PAGE = "create";
const UPDATE_PAGE = "update";

const TaskList = () => {
  const { pageType } = useParams();
  const isNewSession = pageType === CREATE_PAGE; //if isNewSession, display create tasks content, else update tasks
  const navigate = useNavigate();
  const { seshState, dispatch } = useSesh();
  const [seshStatus, setSeshStatus] = useState();
  const [inputError, setInputError] = useState<string | undefined>();
  const [tasks, setTasks] = useState<Object[]>([]);
  const inputRef = useRef<HTMLInputElement>();

  const displayTitle = () => {
    const titleCreate =
      "List tasks that you would like to complete within this session:";
    const titleUpdate =
      "Session completed! Check off the tasks you have completed.";
    return isNewSession ? titleCreate : titleUpdate;
  };

  // const getSesh = async () => {
  //   console.log("tests");
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_APP_API_URL}/sesh/latest_sesh/`,
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("latest sesh =>", JSON.stringify(data, null, 2));
  //     setSeshStatus(data.status);
  //     //tasks should be an array of task objects
  //     dispatch({ type: "UPDATE_SESSION", payload: data });
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  //get session status from database if sesh appears to be blank
  //should only run once

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
      }else if(localSesh.status === "pending"){
        console.log("all good!")
      }else if(localSesh.status === "terminated") {
        console.log("You shouldn't be here. Redirecting to home page...")
        navigate("/")
      }else if(localSesh.status === "completed" && isNewSession){
        console.log("You shouldn't be here. Redirecting to home page...")
        navigate("/")
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
    <div className={`min-h-screen min-w-screen bg-[${backgroundImage}] bg-cover bg-center flex flex-col min-w-screen min-h-screen items-center justify-center`}
    style={{backgroundImage: `url(${backgroundImage})`}}
    >
    {/* <div className="h-screen w-screen bg-orange-100"> */}
    <div className="bg-stone-50/7 0 p-24 rounded-lg">
      <h3>{displayTitle()}</h3>
      {isNewSession ? <CreateTaskForm /> : <UpdateTaskForm />}
    </div>
    </div>
  );
};

export default TaskList;
