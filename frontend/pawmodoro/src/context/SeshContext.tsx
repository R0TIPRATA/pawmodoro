import { ReactNode, useContext, createContext, useReducer } from "react";
import { Bgm, Sesh } from "../types";

type SeshProviderProps = {
  children: ReactNode;
};

type Action =
  | { type: "UPDATE_SESSION"; payload: Sesh }
  | { type: "ADD_TASKS_TO_SESSION"; payload: Object[] }
  | { type: "TOGGLE_PLAY"; payload: boolean }
  
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
  let updatedSesh = {} as Sesh
  switch (action.type) {
    case "UPDATE_SESSION":
      updatedSesh = { ...seshState, ...action.payload }
      localStorage.setItem("sesh", JSON.stringify(updatedSesh));
      return updatedSesh;
    case "TOGGLE_PLAY":
      updatedSesh = { ...seshState, isPaused: action.payload }
      return updatedSesh;
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
  bgm: sessionObj.bgm || {} as Bgm
}) as Sesh;


const setSessionFromLocalStorage = (sessionObj:any) => ({
  id: parseInt(sessionObj.id),
  createdAt: new Date(sessionObj.createdAt),
  expiresIn: new Date(sessionObj.expiresIn),
  tasks: sessionObj.tasks,
  status: sessionObj.status,
  bgm: sessionObj.bgm,
  isPaused: false
}) as Sesh;

  const getLastSesh = async () => {
    console.log("tests");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/sesh/latest_sesh/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      //console.log("last sesh =>", JSON.stringify(data, null, 2));
      const dataInFormat = {
        id: data.id,
        createdAt: new Date(data.created_at),
        expiresIn: new Date(data.expires_in),
        tasks: data.tasks,
        status: data.status,
        isPaused: false
      } as Sesh;
      localStorage.setItem("sesh", JSON.stringify(data));
      //console.log("dataIn Format =>", JSON.stringify(dataInFormat, null, 2));
      return dataInFormat;
    } catch (error) {
      console.error("Error:", error);
    }
  };

//if there is storedSession, update
//if there is no local storage sesh, fetch last session from db

//if there is no stored item in local storage set default value to empty session
const storedSessionStr = localStorage.getItem("sesh");
const defaultSeshValue: Sesh = storedSessionStr ? setSessionFromLocalStorage(JSON.parse(storedSessionStr)) : await getLastSesh()

export const SeshProvider = ({ children }: SeshProviderProps) => {
  const [seshState, dispatch] = useReducer(seshReducer, defaultSeshValue);

  //on loading, check if sesh id is -1. If it is, then run request to get the latest session and set it to seshState

  return (
    <SeshContext.Provider value={{ seshState, dispatch }}>
      {children}
    </SeshContext.Provider>
  );
};
