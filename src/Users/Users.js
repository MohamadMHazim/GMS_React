import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import "./users.css"

function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';
  const [myName, setMyName] = useState('');
  const userContext = useContext(UserContext);
  const [stat, setStat] = useState(null);

  useEffect(() => {
    fetchStat();
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('newUser');
    console.log(storedUser);
    if (storedUser) {
      setMyName(storedUser);
      if (userContext) {
        userContext.setNewUser(storedUser);
      }
    } else if (stat === 1) {
      fetchData();
    }
  }, [stat, userContext,fetchData]);

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
        console.log(stat);
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

  async function fetchData() {
    try {
      const response = await fetch("http://localhost:8000/user", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        const { username1 ,myName, gender , dob} = await response.json();
        if (myName) {
          setMyName(myName);
          localStorage.setItem('newUser', myName);
        }
        if(gender) {
          localStorage.setItem('newGender' , gender);
        }
        if (dob) {
          localStorage.setItem('newDob' , dob);
        }
        if (username1) {
          localStorage.setItem('newUsername' , username1);
        }
      }
    } catch (error) {
      console.error(error);
      console.log('Error fetching data');
    }
  }
    
    const handeLogOut = async () => {
      try {
        const response = await fetch("http://localhost:8000/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (response.ok) {
          setStat(0);
        } else {
          console.log("Failed to update stat in the database");
        }
      } catch (error) {
        console.error(error);
      }
      
      if (userContext) {
        userContext.setNewUser("");
      }
      window.localStorage.removeItem("newUser");
      navigate("/");
    };

  const membershipsPage = () => {
    navigate("/user/memberships", { state: { username: username } });
  };

  const supplementsPage =() => {
    navigate("/user/supplements",{state : {username: username}});
  }
    return (
        <div className="page">
            <div className="page1">
            <div className="navbar1">
            <nav>
                <ul>
                    <li id="myli"><img id="logo" src={require("./Logo.png")} alt="Logo"/></li>
                    <li id="myli"><a id="call">Call us<span class="phone-number">+961 70 905 291</span></a></li>
                    <li id="myli"><a href='/description'>About us</a></li>
                    <li id="myli"><a href="/included">What's Included</a></li>
                    <li id="myli"><a onClick={supplementsPage}>Supplements</a></li>
                    <li id="myli"><a onClick={() => navigate("/ratings")}>Rate us</a></li>
                </ul>
                <button id="signout" onClick={handeLogOut}>Sign out</button>
            </nav>
            </div>
            <div className="p11">
                <h1 id="mytxt"><br/>TRAIN DIFFERENT</h1>
                <h1 id="mytxt1">Welcome , {myName} ! </h1>
                <h1 id="mytxt1"><br/>Seize the opportunity ! It's time to get in <br/>the best shape of your life.
                Redeem your subscription<br/> by subcsribing in our website.</h1>
            </div>
            </div>
            <div className="border" id="border">
                <h1>THERE'S NO LIMIT</h1>
                <h2>You're capable of more than you realise.</h2>
                <button id="get-started" onClick={membershipsPage}> Get Started </button>
                <div className="icons">
                    <a href="https://www.facebook.com">
                        <img src={require("./Facebook-Logo.png")} alt="Facebook icon" />
                    </a>
                    <a href="https://www.instagram.com">
                        <img src={require("./Instagram-Logo.png")} alt="Instagram icon" />
                    </a>
                    <a href="https://www.twitter.com">
                        <img src={require("./X-Twitter.png")} alt="Twitter icon" />
                    </a>
                </div>
                <h3 id="l2">Leave the planning on us, and start the work now.</h3>
            </div>
        </div>
    );
}

export default Users;