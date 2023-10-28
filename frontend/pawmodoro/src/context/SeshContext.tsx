import { ReactNode, useContext, createContext, useReducer } from "react";
import { Sesh, Task } from "../types";

type SeshProviderProps = {
  children: ReactNode;
};

type Action =
  | { type: "UPDATE_SESSION"; payload: Sesh }
  | { type: "ADD_TASKS_TO_SESSION"; payload: Object[] }
  | { type: "GET_TASKS" }
  | { type: "CLEAR_SESSION" }
  
  // or add other types | { type: 'UPDATE };

type SeshContext_ = {
  seshState: Sesh;
  dispatch: React.Dispatch<Action>;
  //user:
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSesh = () => {
  return useContext(SeshContext);
};


const SeshContext = createContext({} as SeshContext_);

// Define the reducer function
const seshReducer = (seshState: Sesh, action: Action) => {
  console.log("default sesh value", defaultSeshValue);
  switch (action.type) {
    case "UPDATE_SESSION":
      const updatedSesh = { ...seshState, ...action.payload }
      localStorage.setItem("sesh", JSON.stringify(updatedSesh));
      return updatedSesh;
      //case "ADD_TASKS_TO_SESSION":
        //const updatedSesh = { ...seshState, ...action.payload }
        //localStorage.setItem("sesh", JSON.stringify(updatedSesh));
        //return { ...seshState, ...action.payload };
    default:
      return seshState;
  }
};


// const defaultSeshValue:Sesh = localStorage.getItem("sesh") 
// ? JSON.parse(localStorage.getItem("sesh")!) : 
// {
//   id: -1,
//   createdAt: {} as Date,
//   sessionDuration: {} as number,
//   expiresIn: new Date(),
//   tasks: [] as Task[],
//   status: ""
// }

const setSession = (sessionObj:any) => ({
  id: parseInt(sessionObj.id) || -1,
  createdAt: new Date(sessionObj.createdAt),
  expiresIn: new Date(sessionObj.expiresIn) || new Date(),
  tasks: sessionObj.tasks || [],
  status: sessionObj.status || "",
}) as Sesh;

const storedSessionJSON = localStorage.getItem("sesh");
const defaultSeshValue: Sesh = storedSessionJSON ? setSession(JSON.parse(storedSessionJSON)) : setSession({});

// const setSession = (sessionObj) => {
//   return {
//     id : parseInt(sessionObj.id),
//     createdAt: new Date(sessionObj.createdAt),
//     expiresIn: new Date(sessionObj.expiresIn),
//     tasks: sessionObj.tasks,
//     status: sessionObj.status
//   } as Sesh
// }

// const defaultSeshValue:Sesh = localStorage.getItem("sesh") 
// ? setSession(JSON.parse(localStorage.getItem("sesh")!)) : 
// {
//   id: -1,
//   createdAt: {} as Date,
//   sessionDuration: {} as number,
//   expiresIn: new Date(),
//   tasks: [] as Task[],
//   status: ""
// }



export const SeshProvider = ({ children }: SeshProviderProps) => {
  const [seshState, dispatch] = useReducer(seshReducer, defaultSeshValue);

  return (
    <SeshContext.Provider value={{ seshState, dispatch }}>
      {children}
    </SeshContext.Provider>
  );
};
