import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import WDashbord from "../Welcome-Dashboard/wDashboard";
const App =  () => {
    const navigate = useNavigate();
    return (
        <div className="app">
            <WDashbord/>
            <button onClick={() => navigate("/login")} id="login-button">Login</button>
            <div className="div1">
                <h1 id="little">Welcome to Fitness Club ! </h1>
                <h1> The Body Achieves</h1>
                <h1>      what the  </h1>
                <h1>   mind believes !  </h1>
            </div>
            <button onClick={() => navigate("/register")} id="butt" >Get Started</button>

        </div>
    );
}
export default App;