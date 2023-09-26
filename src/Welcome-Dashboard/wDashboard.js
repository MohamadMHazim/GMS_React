import React from "react";
import "./wDashbord.css";
import { useNavigate } from "react-router-dom";
export default function WDashboard () {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('newUser');
    function handleback () {
        if (storedUser) {
            navigate(-1);
        }
        else {
            navigate("/");
        }
    }
    return(
        <div className="startNav">
                <ul>
                    <li id="mainli"><a onClick={() => handleback()}><img src={require("./Logo.png")} alt="icon"></img></a></li>
                    <li id="mainli"><a href="/included">What's Included</a></li>
                    <li id="mainli"><a id="contact">Call us<span class="phone-number">+961 70 905 291</span></a></li>
                    <li id="mainli"><a href="/description">About</a></li>
                    <li id="mainli"><a href="/reviews">Reviews</a></li>
                </ul>
            </div>
    )
}