import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import "@progress/kendo-theme-material/dist/all.css";
import {ChartTooltip, Chart, ChartTitle, ChartLegend, ChartSeries, ChartSeriesItem, ChartSeriesLabels, } from "@progress/kendo-react-charts";
import "hammerjs";
import Transactions from "./Transactions/Transactions";
import UserManagement from "./Users/UsersManagement";
import StaffManagement from "./Staff/StaffManagement";
import SupplmentsManagement from "./Supplements/SupplementsManagement";
import AdminManagement from "./Admin-Management/AdminManagement";
import AdminHistory from "./Admin-History/AdminHistory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const labelContent = e => e.category;

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function Admin () {
  const navigate = useNavigate();
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showAddStaff , setShowAddStaff] = useState(false);
  const [showAddAdmins , setShowAddAdmins] = useState(false);
  const [users,setUsers] = useState("");
  const [admin,setAdmin] = useState("");
  const [userCount,setUserCount] = useState("");
  const [staffCount , setStaffCount] = useState("");
  const [suppCount,setSuppCount]=useState("");
  const [transactionCount , setTransactionCount] = useState ("");
  const [totalIncome , setTotalIncome] = useState("");
  const [showAddSupp, setshowAddSupp] = useState("");
  const [showTransactions , setShowTransactions] = useState(false);
  const [showAdminTransactions , setShowAdminTransactions] = useState(false);
  const [stat, setStat] = useState(1);
  const [adminCount , setAdminCount] = useState("");
  const [tadminCount , setTadminCount] = useState("");
  const adminUsername = localStorage.getItem('adminUsername');

  const renderTooltip = (context, data) => {
    const { category, value } = context.point || context;
    const total = data.reduce((sum, dataPoint) => sum + dataPoint.value, 0);
    const percentage = ((value / total) * 100).toFixed(2);
    return (
      <div>
        {category}: {percentage}%
      </div>
    );
  };
  
  const applicationsStatusThisMonth = [
    {
      status: "Users",
      value: userCount,
      color: "#059669",
    },
    {
      status: "Admins",
      value: adminCount,
      color: "#2563EB"  ,
    },
    {
      status: "Staff",
      value: staffCount,
      color: "#B91C1C",
    },
  ];

  const profits = [
    {
      status: "Income",
      value: parseInt(totalIncome),
      color: "#059669",
    },
    {
      status: "Expenses",
      value: 900,
      color: "#B91C1C",
    },
  ];
  
      useEffect(() => {
        if (adminUsername === null) {
          alert("Access is denied.");
          navigate(-1);
        }
      })

      useEffect(() => {
          fetchStat();
      },[])
      
      useEffect(() => {
        fetchData();
    }, []);

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


  async function fetchData () {
      try {
        const response = await fetch("http://localhost:8000/adminDisplay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({adminUsername}),
        });
      if(response.ok) {
          const result = await response.json();
          setUsers(result.results);
          setUserCount(result.userCount);
          setStaffCount(result.staffCount);
          setSuppCount(result.supplementCount);
          setTotalIncome(result.totalIncome);
          setTransactionCount(result.transactionCount);
          setAdmin(result.admin);
          setAdminCount(result.adminCount);
          setTadminCount(result.adminT_count);
      }
    }
      catch (error) {
        console.error(error);
      }
    };

    async function handleLogOut() {
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
          window.localStorage.removeItem("adminUsername");
        } else {
          console.log("Failed to update stat in the database");
        }
      } catch (error) {
        console.error(error);
      }
      navigate("/");
    };

      function handleDashboardClick() {
        setShowAddStaff(false);
        setShowDashboard(true);
        setShowAddMember(false);
        setshowAddSupp(false);
        setShowTransactions(false);
        setShowAddAdmins(false);
        setShowAdminTransactions(false);
      }
    
      function handleAddMemberClick() {
        setShowAddStaff(false);
        setShowDashboard(false);
        setShowAddMember(true);
        setshowAddSupp(false);
        setShowTransactions(false);
        setShowAddAdmins(false);
        setShowAdminTransactions(false);
      }

      function handleAddStaff() {
        setShowAddStaff(true);
        setShowDashboard(false);
        setShowAddMember(false);
        setshowAddSupp(false);
        setShowTransactions(false);
        setShowAddAdmins(false);
        setShowAdminTransactions(false);
      }

      function handleAddSupp () {
        setShowAddStaff(false);
        setShowDashboard(false);
        setShowAddMember(false);
        setshowAddSupp(true);
        setShowTransactions(false);
        setShowAddAdmins(false);
        setShowAdminTransactions(false);
      }

      function handleTranscations () {
        setShowAddStaff(false);
        setShowDashboard(false);
        setShowAddMember(false);
        setshowAddSupp(false);
        setShowTransactions(true);
        setShowAddAdmins(false);
        setShowAdminTransactions(false);
      }

      function handleaddAdmins () {
        setShowAddStaff(false);
        setShowDashboard(false);
        setShowAddMember(false);
        setshowAddSupp(false);
        setShowTransactions(false);
        setShowAddAdmins(true);
        setShowAdminTransactions(false);
      }

      function handleAdminHistory () {
        setShowAddStaff(false);
        setShowDashboard(false);
        setShowAddMember(false);
        setshowAddSupp(false);
        setShowTransactions(false);
        setShowAddAdmins(false);
        setShowAdminTransactions(true);
      }
const search_values = [{ Name: "Dashboard" }, { Name: "Members Management" },{ Name: "Staff Management" },{ Name: "Supplements Management" },{ Name: "Transactions" },{Name: "Admin Management"} , {Name: "Admins History"}];
const [searchItem, setSearchItem] = useState('');
const [filteredUsers, setFilteredUsers] = useState(search_values);

const handleInputChange = (e) => {
  const searchTerm = e.target.value;
  setSearchItem(searchTerm);
  const filteredItems = search_values.filter((user) =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredUsers(filteredItems);
};
const [searchFocused,setSearchFocused] = useState(false);

function handleNavigation(name) {
  if (name === "Members Management") {
    setSearchFocused(false);
    handleAddMemberClick();
  }
  else if (name === "Dashboard") {
    setSearchFocused(false);
  }
  else if (name === "Staff Management") {
    setSearchFocused(false);
    handleAddStaff();
  }
  else if (name === "Supplements Management") {
    setSearchFocused(false);
    handleAddStaff();
  }
  else if (name === "Transactions") {
    setSearchFocused(false);
    handleTranscations();
  }
  else if (name === "Admin Management") {
    setSearchFocused(false);
    handleaddAdmins();
  }
  else if (name === "Admins History") {
    setSearchFocused(false);
    handleAdminHistory();
  }
}
    return(
        <div className="adminPage">
        <div className="dashboard">
          <img className="mainLogo" src={require("./Images/Logo.png")} />
          <div className="nav-options">
          <img src={require("./Images/Dashboard5.png")} />
          <h1 className="clickable" onClick={() => handleDashboardClick()} >Dashboard</h1>
          </div>
          <div className="nav-options">
          <img src={require("./Images/Member.png")} />
          <h1 className="clickable" onClick={() => handleAddMemberClick()}> Members Management </h1>
          </div>
          <div className="nav-options">
          <img src={require("./Images/Staff.png")} />
          <h1 className="clickable" onClick={() => handleAddStaff()}>
            Staff Management
          </h1>
          </div>
          <div className="nav-options">
          <img src={require("./Images/whey.png")} />
          <h1 className="clickable" onClick={() => handleAddSupp()}>
            Supplements Management
          </h1>
          </div>
          <div className="nav-options">
          <img src={require("./Images/Transactions.png")} />
          <h1 className="clickable" onClick={() => handleTranscations()} >Transactions</h1>
          </div>
          {adminUsername === "admin" && 
          <div className="nav-options">
          <img src={require("./Images/Admin.png")} />
          <h1 className="clickable" onClick={() => handleaddAdmins()}>
          Admin Management
          </h1>
          </div>
          }
          {adminUsername === "admin" && 
          <div className="nav-options">
          <img src={require("./Images/Admin-History.png")} />
          <h1 className="clickable" onClick={() => handleAdminHistory()}>
          Admins History
          </h1>
          </div>
          }
          <div className="nav-options">
          <img src={require("./Images/SignOut.png")} />
          <h1 className="clickable" onClick={() => handleLogOut()}>Sign Out</h1>
          </div>
          <div className="mycontainer">
            <div className="row">
              <div className="col-md-12 text-center">
                <h3 className="animate-charcter"> Created by Mohamad Hazim </h3>
              </div>
            </div>
          </div>
        </div>
        {!showAddMember && showDashboard && (
            <div className="mainPage">
              <div className="topDash">
              <h>Fitness Club</h>
              <div className="huge-search">
              <div className="search-box">
                <button className="btn-search">
                  <FontAwesomeIcon icon={faSearch} style={{ color: 'cyan', fontSize: '25.5px', margin: "auto" }} onClick={() => setSearchFocused(false)} />
                </button>
                <input type="text" className="input-search" placeholder="Type to Search..." onFocus={() => setSearchFocused(true)} onChange={handleInputChange} />
              </div>
              <div className={`search-results ${searchFocused && filteredUsers.length > 0 ? 'show' : ''}`}>
                <ul className="search-options">
                  {filteredUsers.map((user, index) => (
                    <li className="search-option" onClick={() => handleNavigation(user.Name)} key={index}>{user.Name}</li>
                  ))}
                </ul>
              </div>
              </div>
                </div>
                <h1 className="welcoming">Administrators Dashboard Page </h1>
                <div className="row1">
    <div className="container">
      {Array.isArray(admin) && admin.map((adminData, index) => (
        <div className="box">
          <div className="image">
            <img src={`data:image/jpeg;base64,${arrayBufferToBase64(adminData.admin_pic.data)}`} alt="" />
          </div>
          <div className="name_job">{adminData.name}</div>
          <p>{adminData.role}</p>
          <div className="btns">
            <button>Enrolled Since: {new Date(adminData.EC).toLocaleDateString()}</button>
            <button>Gender: {adminData.gender}</button>
          </div>
        </div>
      ))}
    </div>
    <div className="tableWrapper">
      <div id="wrapper">
        <table id="keywords" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th><span>Username</span></th>
              <th><span>Gender</span></th>
              <th><span>Age</span></th>
              <th><span>Subscription</span></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(admin) && users.map((user, index) => (
              <tr key={index}>
                <td className="lalign">{user.username}</td>
                <td>{user.gender}</td>
                <td>{getAgeFromDateOfBirth(user.dateOfBirth)}</td>
                <td>{user.weight != null ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div className="boxesClass">
    <div className="boxes">
      <div className="inside-box">
        <h1>Users</h1>
        <img src={require("./Images/Users.png")} alt="" />
      </div>
      <h2>{userCount} users</h2>
    </div>
    <div className="boxes">
      <div className="inside-box">
        <h1>Staff</h1>
        <img src={require("./Images/Fitness-T.png")} alt="" />
      </div>
      <h2>{staffCount} trainers</h2>
    </div>
    <div className="boxes">
      <div className="inside-box">
        <h1>Supplements Types</h1>
        <img src={require("./Images/Supplements-Icon.png")} alt="" />
      </div>
      <h2>{suppCount} types</h2>
    </div>
    <div className="boxes">
      <div className="inside-box">
        <h1>Transactions</h1>
        <img src={require("./Images/Transactions-Icon.png")} alt="" />
      </div>
      <h2>{transactionCount} transactions</h2>
    </div>
    <div className="boxes">
      <div className="inside-box">
        <h1>Total Income</h1>
        <img src={require("./Images/Income.png")} alt="" />
      </div>
      <h2>{totalIncome} $</h2>
    </div>
    {adminUsername === 'admin' &&
    <div className="boxes">
      <div className="inside-box">
        <h1>Admin History</h1>
        <img src={require("./Images/History.png")} alt="" />
      </div>
      {adminUsername === 'admin' ? (<h2>{tadminCount} transactions</h2>) : (<h2>Access is denied.</h2>)}
    </div>
    }
    {adminUsername === 'admin' &&
    <div className="boxes">
      <div className="inside-box">
        <h1>Admins</h1>
        <img src={require("./Images/Admin-Icon.png")} alt="" />
      </div>
      {adminUsername === 'admin' ? (<h2>{adminCount} admins</h2>) : (<h2>Access is denied.</h2>)}
    </div>
      }
  </div>

  <h1 className="welcoming-chart">Charts</h1>
  <div className="chart-class">
    <div className="charts">
      <Chart>
        <ChartTitle text="Registrations" className="chart-title" />
        <ChartLegend visible={false} />
        <ChartTooltip render={context => renderTooltip(context, applicationsStatusThisMonth)} />
        <ChartSeries>
          <ChartSeriesItem type="donut" data={applicationsStatusThisMonth} categoryField="status" field="value">
            <ChartSeriesLabels color="#fff" background="none" content={labelContent} />
          </ChartSeriesItem>
        </ChartSeries>
      </Chart>
    </div>

    <div className="charts">
      <Chart>
        <ChartTitle text="Profits" />
        <ChartLegend visible={false} />
        <ChartTooltip render={context => renderTooltip(context, profits)} />
        <ChartSeries>
          <ChartSeriesItem type="bar" data={profits} categoryField="status" field="value">
            <ChartSeriesLabels color="#fff" background="none" content={labelContent} />
          </ChartSeriesItem>
        </ChartSeries>
      </Chart>
    </div>
  </div>
</div>
            )}
                    {showAddMember && (
                        <UserManagement/>
                      )}
      {showAddStaff && 
        <StaffManagement/>
      }
        {showAddSupp && 
              <SupplmentsManagement/>
          }
            { showTransactions && 
                <Transactions/>
            }

            {showAddAdmins &&
                <AdminManagement/>
              }

                {showAdminTransactions && 
                  <AdminHistory/>
                  }
            </div>
    )
}

export default Admin;