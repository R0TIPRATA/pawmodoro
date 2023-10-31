import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { omit } from "lodash";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  //const inputRef = useRef<HTMLInputElement>();
  // Create the submit method.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    // Create the POST requuest
    //  const {data} = await axios.post('http://localhost:8000/token/', user ,
    //                 {   headers:    {'Content-Type': 'application/json'}
    //                 },
    //                 withCredentials: true
    //             )

    //Create POST request

    // try{
    //     axios({
    //       method: "POST",
    //       url: `${import.meta.env.VITE_APP_API_URL}/users/login`,
    //       data: {
    //         username: user.username,
    //         password: user.password,
    //       },
    //       withCredentials: true,
    //     }).then((response) => {
    //       // console.log(response.data);
    //       if(response.data.success) {
    //         // setUserToken({username: response.data.cookies.username, token: response.data.cookies.token});
    //         setTimeout(() => {
    //           navigate("/")
    //         }, 500);
    //       } else {
    //         setMessage(response.data.message)
    //       }
    //     })

    //   } catch (err) {
    //     console.log("An error occurred: ", err);
    //   }
    // };
    try {
      axios({
        method: "POST",
        url: `${import.meta.env.VITE_APP_API_URL}/auth/login`,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        headers: {
          //'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
          "Content-Type": "application/json",
          accept: "application/json",
        },
        data: {
          username: user.username,
          password: user.password,
        },
        withCredentials: true,
      }).then((response) => {
        console.log("login success! response : " ,response);
        if (response.status === 200) {
          //setAuth({ user: response.data.user, accessToken: response.data.token});
          localStorage.setItem('accessToken', response.data.token);
          //localStorage.setItem('user', omit(response.data.user, 'password'));
          //localStorage.setItem('refresh_token', data.refresh);
          setTimeout(() => {
            navigate("/")
            //navigate(from, {replace: true});
          }, 500);
        } else {
          setErrorMsg("An error occured, please try again.")
        }
      });
    } catch (err) {
      console.log("An error occurred: ", err);
      setErrorMsg("An error occured, please try again.")
    }
  };

  //     if (response.ok) {
  //         const data = await response.json();
  //         localStorage.clear();
  //         localStorage.setItem('access_token', data.access);
  //         localStorage.setItem('refresh_token', data.refresh);
  //     }

  // // Initialize the access & refresh token in localstorage.
  // localStorage.clear();
  // localStorage.setItem('access_token', data.access);
  // localStorage.setItem('refresh_token', data.refresh);
  // axios.defaults.headers.common['Authorization'] =
  //                                 `Bearer ${data['access']}`;
  // window.location.href = '/'
  //}
  return (
    //   <div className="Auth-form-container">
    //     <form className="Auth-form" onSubmit={submit}>
    //       <div className="Auth-form-content">
    //         <h3 className="Auth-form-title">Sign In</h3>
    //         <div className="form-group mt-3">
    //           <label>Username</label>
    //           <input className="form-control mt-1"
    //             placeholder="Enter Username"
    //             name='username'
    //             type='text' value={username}
    //             required
    //             onChange={e => setUsername(e.target.value)}/>
    //         </div>
    //         <div className="form-group mt-3">
    //           <label>Password</label>
    //           <input name='password'
    //             type="password"
    //             className="form-control mt-1"
    //             placeholder="Enter password"
    //             value={password}
    //             required
    //             onChange={e => setPassword(e.target.value)}/>
    //         </div>
    //         <div className="d-grid gap-2 mt-3">
    //           <button type="submit"
    //              className="btn btn-primary">Submit</button>
    //         </div>
    //       </div>
    //    </form>
    //  </div>

    <div className=" bg-slate-50 p-8 rounded-3xl max-w-lg flex flex-row flex-wrap m-20">
      <div className="text-xl font-semibold">Account Login</div>
      <Link className="basis-1/2 text-right" to="/register">Register</Link> 
      <form className="basis-full mt-4" onSubmit={handleSubmit}>
      <Stack>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormControl>
        {errorMsg && <div className="bg-red-100 text-red-700 py-3 w-full text-center mt-3 mx-auto">{errorMsg}</div>}
      </Stack>
        <Button type="submit" sx={{mt: 2, width: 1}}>Login</Button>
        {/* {fieldItems.map((item, index) => {
              if (item.type === "text-input") {
                return (
                  <UsernameInput
                    key={index}
                    label={item.label}
                    name={item.name}
                    handleInput={handleInput}
                    required={item.required}
                  />
                )
              } else if (item.type === "password-input") {
                return (
                  <PasswordInput
                    key={index}
                    label={item.label}
                    name={item.name}
                    handleInput={handleInput}
                    required={item.required}
                  />
                )
              }
            })}
            {message && 
              <div className="bg-red-100 text-red-700 py-3 w-full text-center mt-3 mx-auto">{message}</div>}
            <button type="submit" className="btn btn-primary mr-0 ml-auto mt-4 block">Login</button> */}
      </form>
    </div>
  );
};

export default Login;
