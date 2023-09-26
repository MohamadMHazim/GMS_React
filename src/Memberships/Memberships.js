import React, { useContext } from 'react';
import { useEffect } from 'react';
import './Memberships.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import UserContext from '../UserContext';
import { useCallback } from 'react';

function Memberships() {
  const [myName, setNewUser] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate , setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [username1,setUsername1] = useState("");
  const location = useLocation();
  const username = location.state?.username || "";
  const [stat, setStat] = useState(null);
  const [staff,setStaff] = useState("");
  const [myTrainer , setTrainer] = useState("");
  const[id,setId] = useState("");
  const [sub,setSub] = useState("");
  const userContext = useContext(UserContext);

  function getAgeFromDateOfBirth(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function backpage () {
    console.log(localStorage);
    navigate(-1);
  }

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/mem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        const {username1, myName, gender, dob, weight, height, goal , id , trainer_ind,subscriptionValidityDate } = await response.json();
        if (myName) {
          localStorage.setItem('newUser', myName);
          setNewUser(myName);
        }
        if (gender) {
          localStorage.setItem("newGender" , gender);
          setGender(gender);
        }
        if (dob) {
          localStorage.setItem("dob" , dob);
          setDob(dob);
        }
        if (username1) {
          localStorage.setItem("newUsername" , username1);
          setUsername1(username1);
        }
        setWeight(weight);
        setHeight(height);
        setGoal(goal);
        setTrainer(trainer_ind);
        setId(id);
        setSub(subscriptionValidityDate);
      }
    } catch (error) {
      console.error(error);
    }
  }, [username, userContext]);

  useEffect(() => {
    fetchStat();
    fetchTrainers();
    fetchData();
  },[]);

  async function fetchTrainers () {
    try {
      const response = await fetch("http://localhost:8000/fetchTrainers", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ }),
      });
        
      if (response.ok) {
        const {staff} = await response.json();
        setStaff(staff);
        console.log(staff);
      }
  }
     catch (error) {
      console.error(error);
      console.log('Error fetching stat');
    }
  }

  async function fetchStat() {
    try {
      const response = await fetch("http://localhost:8000/status", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ }),
      });
        
      if (response.ok) {
        const { stat } = await response.json();
        if (stat !== undefined) {
          setStat(stat);
        }
        if (stat !== 1) {
          alert("Please Login First !");
          navigate("/login");
        }
      }
    }
     catch (error) {
      console.error(error);
      console.log('Error fetching stat');
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('newUser');
    const storedGender = localStorage.getItem('newGender');
    const storedDob = localStorage.getItem('newDob');
    const storedUsername1 = localStorage.getItem('newUsername');
    console.log(localStorage);
    if (storedUser) {
      setNewUser(storedUser);
      setGender(storedGender);
      setDob(storedDob);
      setUsername1(storedUsername1);
      fetchTrainers();
    } else {
      fetchData();
      fetchTrainers();
    }
  }, [userContext,fetchData]);
      
        const navigate = useNavigate();
        async function enroll(username, weight, height, goal, trainer, price, cardNumber, cardholderName, expiryDate, cvv) {
          console.log(weight);
          const id = Math.floor(Math.random() * 1000000);
            const response = await fetch("http://localhost:8000/memData", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, weight, height, goal, trainer, price, cardNumber, cardholderName, expiryDate, cvv, id }),
            });
            if (response.ok) {
              const data = await response.json();
              const newBalance = data.newBalance;
              const newdate = data.nextMonth;
              console.log(data.nextMonth);
              if (newBalance !== undefined) {
                alert("You've registered successfully !");
                alert(`Your new balance is ${newBalance}`);
              }
              alert(`Your ID is ${id}. Show it to your personal trainer ${trainer} at the gym and they will take care of the rest. Enjoy!`);
              var newDate = new Date(newdate);
              var options = { year: 'numeric', month: 'long', day: 'numeric' };
              var localizedDateString = newDate.toLocaleDateString(undefined, options);
              console.log(localizedDateString);
              alert('Your subscription is valid till: ' + localizedDateString);
            } 
            else if (response.status === 400) {
              const data = await response.json();
              console.log(data.error);
              if (data.error === "Invalid card details") {
                alert("Registration failed. Please check your card details and try again.");
              } else if (data.error === "Invalid user details") {
                alert("Registration failed. Please check your user details and try again.");
              } else if (data.error === "No rows were updated") {
                alert("Registration failed. No rows were updated.");
              } else if (data.error === "You are already registered !") {
                alert(`Registration failed. You are already registered!`);
              } else if (data.error === "Insufficient balance") {
                alert("Registration failed. Insufficient balance.");
              } 
              else {
                alert("Registration failed. Please check your details and try again.");
              }
            } else {
              alert("Registration failed. Please check your internet connection and try again.");
            }
          }

        return (
        <div className="Mem">
            <button onClick={backpage} id='myBut'> Back </button>
            <div className="user-info-container">
            <h2>User Information</h2>
            <table>
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{myName}</td>
                  <td>Gender:</td>
                  <td>{gender}</td>
                </tr>
                <tr>
                  <td>Age:</td>
                  <td>{getAgeFromDateOfBirth(dob)}</td>
                  <td>Weight (kg):</td>
                  <td>
                    {weight === null ? ( <input className="form-input" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="80" /> ) : ( <span>{weight}</span> )}
                  </td>
                </tr>
                <tr>
                <td>Height:</td>
                <td>
                {height === null ? (
                <input className="form-input" type="number" value={height} onChange={(event) => setHeight(event.target.value)} placeholder="185" />
                ) : (
                <span>{height}</span>
                )}
                </td>
                <td>Goals:</td>
                <td>
                  {goal === null ? ( <select className="form-input" value={goal} onChange={(event) => setGoal(event.target.value)} > <option value="">Select a goal</option> <option value="weight-loss">Weight Loss</option> <option value="weight-gain">Weight Gain</option> <option value="body-composition">Body Composition</option> </select> ) : ( <span>{goal}</span> )}
                </td>
                </tr>
                {height === null ? (
                <tr>
                  <td>Card Number:</td>
                  <td>
                    <input className="form-input" type="text" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder='894018452' required />
                  </td>
                  
                  <td>Cardholder Name:</td>
                  <td>
                    <input className="form-input" type="text" value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} placeholder='John Smith' required />
                  </td>
                </tr>
                ) : (
                  <tr>
                  <td>Trainer: </td>
                  <td>
                  <span>{myTrainer}</span>
                  </td>
                  <td>ID: </td>
                  <td>
                  <span>{id}</span>
                  </td>
                  </tr>
                )}
                {height === null && (
                <tr>
                  <td>Expiry Date:</td>
                  <td>
                    <input className="form-input" type="text" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} pattern="(0[1-9]|1[0-2])\/[0-9]{2}" placeholder='MM/YY' required />
                  </td>
                  <td>CVV:</td>
                  <td>
                    <input className="form-input" type="text" value={cvv} onChange={(event) => setCvv(event.target.value)} placeholder='572' required />
                  </td>
                </tr>
                )}
                {height != null && (
                  <tr>
                    <td>Subscription Ends on: </td>
                    <td><span>{new Date(sub).toLocaleDateString()}</span></td>

                    <td>Paid Using: </td>
                    <td><span>Mastercard</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        <div className="trainers-container">
        {Array.isArray(staff) && staff.map((trainer, index) => (
        <div className="trainer">
      <div key={index}>
      <a>
      <img src={`data:image/jpeg;base64,${arrayBufferToBase64(trainer.photo.data)}`} alt='trainer_image' className="trainerimage"/>
      </a>
      <div className="trainer-info">
        <h2>{trainer.trainer_name}</h2>
        <p>Program: {trainer.program}</p>
        <p>Training Days: {trainer.training_days}</p>
        <p>Price: ${trainer.program_price}/month</p>
        <p>Working hours: {trainer.working_hours}</p>
        <div className='big-div'>
          <a href="https:www.facebook.com">
            <img src={require("./Project Images/Facebook-Logo.png")} alt={`Logo ${index + 1}`} />
          </a>
        <button className="subscribe-button" onClick={() => enroll( username1, weight, height, goal, trainer.trainer_name, trainer.program_price, cardNumber, cardholderName, expiryDate, cvv )}> Enroll </button>
        </div>
      </div>
    </div>
    </div>
  ))}
        </div>
        <div class="footer">
        <div class="social-media-icons">
            <p>Follow us on social media:</p>
            <div class="iconnn">
            <a href=""><img src={require("./Project Images/Facebook-Logo.png")} alt='icons'/></a>
            <a href=""><img src={require("./Project Images/X-Twitter.png")} alt='icons'/></a>
            <a href=""><img src={require("./Project Images/Instagram-Logo.png")} alt='icons'/></a>
            </div>
        </div>
        <p>Contact us: +961 70905291 / mohamadhazim31@gmail.com</p>
    </div>
        </div>
    );
    }

    export default Memberships;