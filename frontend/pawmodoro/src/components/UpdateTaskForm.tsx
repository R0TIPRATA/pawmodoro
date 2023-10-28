import { Button, Checkbox } from "@mui/joy";
import { useSesh } from "../context/SeshContext";
import { useEffect, useState } from "react";
import { Task } from "../types";

const UpdateTaskForm = () => {
  // get tasklist from user context
  const { seshState } = useSesh();
  const [checkedTasks, setCheckedTasks] = useState<Object[]>([]);

  const displayTask = (task: Task) => {
    return (
      <li>
        <Checkbox
          label={task.task}
          onClick={(event) => {
            const checked = event.target.checked;
            if (checked) {
              setCheckedTasks(prevArr => [...prevArr, { id: task.id }]);
            } else {
              //remove from checkedTasks
              setCheckedTasks( prevArr => prevArr.filter((item:Object) => item.id !== task.id));
            }
            console.log("checked?: ", event.target.checked);
          }}
        />
      </li>
    );
  };

  //on click next, update task to complete in db
  //redirect to show exp points
  const onClick = () => {
    if (checkedTasks.length > 0) updateTasksComplete();
  };

  const updateTasksComplete = async () => {
    //sconsole.log("tasks in list => ", checkedTasks);
    // update task
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/task/bulk_update/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkedTasks),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
    //store session in context?
  };

  return (
    <div>
      <ul>{seshState?.tasks?.map((task) => displayTask(task))}</ul>
      <Button onClick={onClick}>Next</Button>
    </div>
  );
};

export default UpdateTaskForm;
