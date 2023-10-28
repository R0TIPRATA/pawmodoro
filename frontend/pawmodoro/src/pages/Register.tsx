import { Stack, FormControl, FormLabel, Input, Button } from "@mui/joy";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate()
    const [user,setUser] = useState({
        //name: "",
        email: "",
        username: "",
        password: ""
    })

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            axios({
              method: "POST",
              url: `${import.meta.env.VITE_APP_API_URL}/auth/register`,
              // headers: {
              //   'Content-Type': 'application/json',
              // },
              headers: {
                //'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                "Content-Type": "application/json",
                accept: "application/json",
              },
              data: {
                //name: user.name,
                email: user.email,
                username: user.username,
                password: user.password,
              },
              withCredentials: true,
            }).then((response) => {
              console.log(response.data.status);
              if (response.status === 200) {
                // setUserToken({username: response.data.cookies.username, token: response.data.cookies.token});
                //localStorage.setItem('access_token', response.data.token);
                //localStorage.setItem('refresh_token', data.refresh);
                setTimeout(() => {
                  navigate("/login")
                }, 500);
              } else {
                //error logging here
                console.log("an error occured.")
                //setErrorMsg("An error occured, please try again.")
              }
            });
          } catch (err) {
            console.log("An error occurred: ", err);
            setErrorMsg("An error occured, please try again.")
          }
    }

  return (
    <div className=" bg-slate-50 p-8 rounded-3xl max-w-lg flex flex-row flex-wrap m-20">
      <div className="text-xl font-semibold">Account Registration</div>
      <Link className="basis-1/2 text-right" to="/login">
        Login
      </Link>
      <form className="basis-full mt-4" onSubmit={handleSubmit}>
        <Stack>
        {/* <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              onChange={(event) => setUser({...user, name: event.target.value})}
            />
          </FormControl> */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              onChange={(event) => setUser({...user, email: event.target.value})}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              onChange={(event) => setUser({...user, username: event.target.value})}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              onChange={(event) =>  setUser({...user, password: event.target.value})}
            />
          </FormControl>
          {/* {errorMsg && (
            <div className="bg-red-100 text-red-700 py-3 w-full text-center mt-3 mx-auto">
              {errorMsg}
            </div>
          )} */}
        </Stack>
        <Button type="submit" sx={{ mt: 2, width: 1 }}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Register;
