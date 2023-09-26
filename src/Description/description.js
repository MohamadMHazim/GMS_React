import React from "react";
import "./description.css";
import WDashboard from "../Welcome-Dashboard/wDashboard";
import {useNavigate } from "react-router-dom";

function Description () {
    const navigate = useNavigate();
    return(
        <div className="description">
            <WDashboard/>
            <div className="about-us">
    <ul>
    <input type="radio" id="list-1" name="list" value="list-1"/>
    <li>
      <label for="list-1"></label>
      <p>Who are we ?</p>
    </li>
    <input type="radio" id="list-2" name="list" value="list-1"/>
    <li>
      <label for="list-2"></label>
      <p>Why us ?</p>
    </li>
    <input type="radio" id="list-3" name="list" value="list-1"/>
    <li>
      <label for="list-3"></label>
      <p>Special Features</p>
    </li>
    <input type="radio" id="list-4" name="list" value="list-1"/>
    <li>
      <label for="list-4"></label>
      <p>Get in the shape of your life</p>
    </li>
    <input type="radio" id="list-5" name="list" value="list-1"/>
    <li>
      <label for="list-5"></label>
      <p>Classes & Private Training</p>
    </li>
    <input type="radio" id="list-6" name="list" value="list-1"/>
    <li>
      <label for="list-6"></label>
      <p>Conclusion</p>
    </li>
  </ul>

</div>
        </div>
    )
}
export default Description