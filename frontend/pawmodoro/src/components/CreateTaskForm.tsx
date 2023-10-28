import { InfoOutlined } from "@mui/icons-material";
import { FormControl, Input, FormHelperText, Button } from "@mui/joy";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSesh } from "../context/SeshContext";
import { DateTime, Duration } from "luxon";
import CloseIcon from '@mui/icons-material/Close';
import { Task } from "../types";


const CreateTaskForm = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputError, setInputError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const { seshState, dispatch } = useSesh();
    //export type Task = {
//     id: string
//     seshId: string
//     createdAt: Date
//     task: string
//     completed?: boolean 
// }

  const handleClick = () => {
    if (inputRef.current!.value.length === 0) {
      setInputError("Please enter a task!");
      return;
    }
    const newTask = inputRef.current!.value;
    setTasks([
      ...tasks,
      {
        task: newTask!,
        completed: false
      },
    ]);
    inputRef.current!.value = "";
  };

  //update expiry time

  const convertToDateTime = (sessionDuration: number) => {
    const now = DateTime.now();
    const dur = Duration.fromObject({ seconds: sessionDuration });
    //setSession({ ...session, expiresIn: now.plus(dur) });
    return now.plus(dur).toJSDate();
  };

  const updateExpiryTime = async() => {
    const dataForm = {
      id: seshState.id,
      expiresIn: convertToDateTime(seshState.sessionDuration!),
      status:"ongoing"
    }
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
        dispatch({ type: "UPDATE_SESSION", payload: {...dataForm} });
        navigate("/sesh");
    } catch (error) {
        console.error("Error:", error);
      }
  }
  const createNewList = async () => {
    const dataForm = {
      sesh_id: seshState.id,
      tasks: tasks,
    };
    //create tasks Array
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/task/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataForm),
        }
      );
      const data = await response.json();

      //tasks should be an array of task objects
      //dispatch({ type: "ADD_TASKS_TO_SESSION", payload: data });
      dispatch({ type: "UPDATE_SESSION", payload: {tasks: data} });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startSession = () => {
    createNewList();
    updateExpiryTime();
  };

  const removeTask = (taskItem:string) => {
    const newArr = tasks.filter(task => task.task !== taskItem)
    setTasks(newArr)
  }

  const TaskItem = ({ itemContent }: { itemContent: Task }) => {
    return <li>{itemContent.task} <span onClick={()=>removeTask(itemContent.task)}><CloseIcon /></span></li>;
  };

  return (
    <div>
      <ul>
        {tasks &&
          tasks.map((task, index) => (
            <TaskItem key={index} itemContent={task} />
          ))}
      </ul>
      {tasks.length < 5 ? (
        <FormControl error={inputError !== undefined}>
          <Input
            name="task"
            placeholder="Type a task"
            onClick={() => setInputError(undefined)}
            slotProps={{
              input: {
                ref: inputRef,
              },
            }}
          />
          {inputError && (
            <FormHelperText>
              <InfoOutlined />
              {inputError}
            </FormHelperText>
          )}
          <Button onClick={handleClick}>Add to list</Button>
        </FormControl>
      ) : (
        <p>Maximum number of tasks reached.</p>
      )}
      <Button onClick={startSession}>Next</Button>
    </div>
  );
};

export default CreateTaskForm;
