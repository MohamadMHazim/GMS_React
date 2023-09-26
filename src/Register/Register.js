import React, { useState } from "react";
import "./Registerfix.css";
import { Link, useNavigate } from "react-router-dom";
import WDashbord from "../Welcome-Dashboard/wDashboard";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (name.trim().length === 0) {
      alert("Please enter a name");
      return;
    } 
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (username.trim().length === 0) {
      alert("Please enter a username");
      return;
    } else if (/\s/.test(username)) {
      alert("Username should not contain spaces");
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password should have minimum 8 characters, one special character, one upper case and one lower case letter"
      );
      return;
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (gender.trim().length === 0) {
      alert("Please select your gender");
      return;
    }
    if (!dateOfBirth) {
      alert("Please enter your date of birth");
      return;
    }  

    const data = { name, email, username, password, gender,dateOfBirth };
    console.log(data);
    fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then( async (response) => {
        console.log(response);
        if (response.ok) {
          console.log("User registered successfully");
          alert("User registered successfully, we'll take you to the login page");
          navigate("/login");
        }
        else if (response.status === 400) {
          const data = await response.json();
          if (data.error === "Email or username already in use"){
            alert("Email or username already in use");
          }
        }
        else if(response.status === 409) {
          alert("Username already in use by an Administrator.");
        } 
        else {
          console.error("Failed to register user");
        }
      })
      .then((data) => {
        if (data && data.error) {
          alert(data.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="reg">
      <WDashbord/>
      <div className="form-container">
      <div className="sign">
        <h1>Sign Up Here ! </h1>
        <img id="arrow" src={require("./Red-Arrow.png")} alt="Arrow" />
      </div>
      <div className="reg-form">
        <div>
          <h1 id="big">Join Us</h1>
        </div>
        <form id="myform">
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your Full Name" value={name} onChange={(event) => setName(event.target.value)} required/>

          <label htmlFor="email">Email: </label>
          <input type="email" id="email" name="email" placeholder="Enter your Email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" placeholder="Enter your Username" value={username} onChange={(event) => setUsername(event.target.value)} required/>

          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" placeholder="Enter your Password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required/>

          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" value={gender} onChange={(event) => setGender(event.target.value)} required> <option value="">Select your gender</option> <option value="male">Male</option> <option value="female">Female</option> </select>

          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)}required />
              <div className="button-container">
            <button onClick={() => navigate(-1)} id="backi"> Back </button>
            <button id="register" onClick={handleSubmit}> Register </button>
        </div>
        </form>
      </div>
      </div>
    </div>
  );
}
export default Register;