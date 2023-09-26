import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import "./Reviews.css"
import WDashboard from "../Welcome-Dashboard/wDashboard";
export default function Reviews() {
    const storedUser = localStorage.getItem('newUser');
    const [ratings,setRatings] = useState("");
    useEffect(() => {
        fetchData();
    },[])
async function fetchData () {
        try {
          const response = await fetch("http://localhost:8000/ratingsDisplay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
        if(response.ok) {
            const result = await response.json();
            setRatings(result);
            console.log(ratings);
        }
      }
        catch (error) {
          console.error(error);
        }
      };
    return(
        <div className="reviews-page">
          <WDashboard/>
            <h1>Our Customers Reviews</h1>
                <div className="containers">
                <div className="col-md-8 ratings-container">
                    {Array.isArray(ratings) &&ratings.map((rating) => (
                    <div className="card p-3" key={rating.id}>
                        <div className="user d-flex flex-row align-items-center">
                        <img src={require("./Admin-Icon.png")} width="30" className="user-img rounded-circle mr-2" alt="User Avatar" />
                        <span>
                        <small className="font-weight-bold text-primary"> {rating.username ? rating.username : "Old User"} </small>
                            <small className="font-weight-bold">{rating.text}</small>
                        </span>
                        </div>
                        <small>{[...Array(rating.rating)].map((_, index) => (
                <FontAwesomeIcon key={index} icon={faStar} size={20} className="text-primary" />
              ))}</small>
                    </div>
                    ))}
                </div>
                </div>
        </div>
    )
}