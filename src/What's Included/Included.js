import React from "react";
import "./Included.css";
import { useNavigate } from "react-router-dom";
import WDashboard from "../Welcome-Dashboard/wDashboard";
function Included() {
  const navigate = useNavigate();
  const checkLogin  = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      alert('Please login first.');
    }
    else{
      console.log("done");
      navigate("/user/memberships");
    } }
  return (
    <div className="mainP">
      <WDashboard/>
      <h2 id="first">What's Included in your Membership: </h2>
      <br/>
      <h2 id="first1">At Fitness Club, we believe that fitness should be accessible to everyone. That's why we offer a wide range of amenities and services to help you reach your fitness goals. Here's what's included in your membership:</h2>
      <br/>
      <div className="conatiner">
<div className="wrap">
	<div className="box one"> <div className="date"> </div> <h1>Equipment</h1> <div className="poster p8"> <h4>1</h4> </div> </div>
	
	<div className="box two"> <div className="date"> </div> <h1>Fitness Classes</h1> <div className="poster p2"> <h4>2</h4> </div> </div>
	
	<div className="box three"> <div className="date"> </div> <h1>Private Training</h1> <div className="poster p3"> <h4>3</h4> </div> </div>
	
	<div className="box five"> <div className="date"> </div> <h1>Locker Rooms</h1> <div className="poster p4"> <h4>4</h4> </div> </div>
	
	<div className="box six"> <div className="date"> </div> <h1>Pool</h1> <div className="poster p5"> <h4>5</h4> </div> </div>
	
	<div className="box seven"> <div className="date"> </div> <h1>Sauna and Steam</h1> <div className="poster p6"> <h4>6</h4> </div> </div>
	
	<div className="box eight"> <div className="date"> </div> <h1>Cafe</h1> <div className="poster p7"> <h4>7</h4> </div> </div>
	
	<div className="box nine"> <div className="date"> </div> <h1>Supplements</h1> <div className="poster p8"> <h4>8</h4> </div> </div>
</div>

</div>
<h2>Sign up for a membership today and start enjoying all of these great amenities and services!</h2>
<button id="signup" onClick={checkLogin}>Sign Up Today!</button>
    </div>
  );
}

export default Included;