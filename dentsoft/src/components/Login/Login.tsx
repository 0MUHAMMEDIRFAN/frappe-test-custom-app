import "./Login.css";
import React, { useContext, useState, useEffect } from "react";
import Logo from "../../assets/DentalLogo.svg";
import showPasswordIcon from "../../assets/ShowPassword.svg";
import hidePasswordIcon from "../../assets/HidePassword.svg";
import { useNavigate } from "react-router-dom";
import { loginToApp } from "../../Api/Index";
import { loginUser } from "../../Api/UserApi";
import { AppContext } from "../../contexts/AppContext";
import { ApiContext } from "../../contexts/ApiContext";

function Login() {
  const { selectedPatient, userDetails } = useContext(AppContext);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deselectPatient, setUserDetails } = useContext(AppContext)
  const navigate = useNavigate();
  const [form, setForm] = useState({
    // email: "",
    // password: "",
    usr: "",
    pwd: "",
  });
  const adminLogin = async () => {
    try {
      const payload = form;
      const login = await loginToApp(payload);
      console.log(login, "Login Successful");
      setUserDetails(login.admin)
      localStorage.setItem("userDetails", JSON.stringify(login.admin));
      localStorage.setItem("access_token", login.access_token);
      localStorage.setItem("refresh_token", login.refresh_token);
      setForm(() => ({
        // email: "",
        // password: "",
        usr: "",
        pwd: "",
      }));
      deselectPatient();
      navigate("/");
      setLoading(false)
    } catch (error: any) {
      // if (error.message === "Invalid email or password") {
      // userLogin();
      // }
      // else {
      console.log(error.message);
      setError(error.message);
      setLoading(false)
      // }

    }
  };
  const userLogin = async () => {
    try {
      const payload = form;
      const login = await loginUser(payload);
      console.log(login, "Login Successful");
      setUserDetails(login.full_name)
      localStorage.setItem("userDetails", JSON.stringify(login.full_name));
      localStorage.setItem("access_token", login.access_token);
      localStorage.setItem("refresh_token", login.refresh_token);
      setLoading(false)
      setForm(() => ({
        // email: "",
        // password: "",
        usr: "",
        pwd: "",
      }));
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
      setLoading(false)
      setError(error.message);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!loading) {
      setError("");
      loginAsAdmin ? adminLogin() : userLogin()
      setLoading(true)
    }
  };
  
  const changeLoginType = () => {
    if (!loading) {
      setLoginAsAdmin(!loginAsAdmin);
      setForm({
        // email: "",
        // password: "",
        usr: "",
        pwd: "",
      })
    }
  }
  return (
    <div className="loginContainer">
      <div className="logo pop_up">
        <img src={Logo} alt="" />
      </div>
      <form className="loginForm relative pop_up" onSubmit={handleSubmit}>
        <h1 className="flex items-center justify-center w-full custom-transition ">Login<p className={`${loginAsAdmin ? "w-[80px]" : "opacity-0 w-0"} text-base font-medium whitespace-nowrap custom-transition`}>&nbsp;as admin</p></h1>
        <div className="rounded-md">
          <input
            type="text"
            onChange={handleChange}
            value={form.usr}
            id="email"
            name="usr"
            required
            autoComplete=""
            disabled={loading}
          />
          <p>Enter your email</p>
        </div>
        <div className="rounded-md relative">
          <input
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            value={form.pwd}
            id="password"
            name="pwd"
            required
            autoComplete="new-password"
            disabled={loading}
          />
          <p>Password</p>
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
            {showPassword ?
              <img src={showPasswordIcon} alt="" />
              : <img src={hidePasswordIcon} alt="" />
            }
          </span>
        </div>
        <div className="source">
          <p className="login-error">{error}</p>
          <a className="custom-transition" onClick={changeLoginType}>{loginAsAdmin ? "Are you a User ?" : "Are you an Admin ?"}</a>
        </div>
        <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : "hover:bg-[#3E42FA]"} text-sm bg-[#6063FF] w-full h-12 font-semibold rounded-md custom-transition text-white`} type="submit">{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Login"}</button>
      </form>
    </div>
  );
}

export default Login;
