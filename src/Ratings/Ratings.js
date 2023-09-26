import React from "react";
import "./Ratings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
export default function Ratings() {
    useEffect(() => {
        fetchStat();
      },[]);
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

    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [stat, setStat] = useState(null);
    const [myText,setMyText]=useState("");
    async function sendRating (rating) {
        if(myText === null || myText.length === 0 ){
            alert("Please fill the box.");
            return;
        }
        try {
            const response = await fetch("http://localhost:8000/rating", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({rating,myText,username}),
            });
            if(response.status === 200) {
                alert("Response Submitted ! Thank you for your time !");
                navigate("/user");
            }
            else if (response.status === 409) {
                alert("You already submitted a review");
            }
        }
        catch(error){
            console.error(error);
        }
    }
    return (
        <div className="ratings-page">
            <h1>Ratings</h1>
            <ul>
                <li>- Type your review</li>
                <li>- Select the star rating</li>
            </ul>
                <div className="stars">
                <form action="">
                <div className="star-wrapper">
                    <a href="#5" className="s1" onClick={() => sendRating(5)}><FontAwesomeIcon icon={faStar} size={20} /></a>
                    <a href="#4" className="s2" onClick={() => sendRating(4)}><FontAwesomeIcon icon={faStar} size={20} /></a>
                    <a href="#3" className="s3" onClick={() => sendRating(3)}><FontAwesomeIcon icon={faStar} size={20} /></a>
                    <a href="#2" className="s4" onClick={() => sendRating(2)}><FontAwesomeIcon icon={faStar} size={20} /></a>
                    <a href="#1" className="s5" onClick={() => sendRating(1)}><FontAwesomeIcon icon={faStar} size={20}/></a>
                </div>
                </form>
                </div>
                <div className="rev-box">
                    <input type="text" value={myText} onChange={(event) => setMyText(event.target.value)} required/>
                    <label className="review" for="review">Brief Review</label>
                </div>
        </div>
    )
}