import React, { useState } from "react";
import "./UsersManagement.css";
import { useEffect } from "react";

export default function UserManagement() {
    useEffect(() => {
        fetchData();
    }, []);

    const [users,setUsers] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [editedName, setEditedName] = useState('');
    const [editedUsername, setEditedUsername] = useState('');
    const [editedDateOfBirth, setEditedDateOfBirth] = useState('');
    const [editedGender, setEditedGender] = useState('');
    const [editedWeight, setEditedWeight] = useState('');
    const [editedHeight, setEditedHeight] = useState('');
    const [editedEmail , setEditedEmail] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showAddRow, setShowAddRow] = useState(false);
    const adminUsername = localStorage.getItem('adminUsername');

    const startEdit = (user) => {
        setSelectedUserId(user.username);
        setEditedName(user.name);
        setEditedUsername(user.username);
        const userDateOfBirth = new Date(user.dateOfBirth);
        const year = userDateOfBirth.getFullYear();
        const month = String(userDateOfBirth.getMonth() + 1).padStart(2, '0');
        const day = String(userDateOfBirth.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setEditedDateOfBirth(formattedDate);
        setEditedGender(user.gender);
        setEditedWeight(user.weight);
        setEditedHeight(user.height);
        setEditedEmail(user.email);
        setShowAddRow(false);
      };

      function cancelclick () {
        setSelectedUserId(null);
        setName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setGender("");
        setDateOfBirth("");
        setShowAddRow(false);
      }

      async function deleteUsers(username) {
        try {
          const response = await fetch("http://localhost:8000/deleteUsers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({username,adminUsername}),
          });
          if(response.ok) {
            alert("User Successfully Deleted !");
            fetchData();
            }
            else{
              alert("User not deleted.");
            }
        }
        catch (error) {
          console.error(error);
        }
      }

      async function saveChanges  (user)  {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (editedName.trim().length === 0) {
          alert("Please enter a name");
          return;
        } 
        if (!emailRegex.test(editedEmail)) {
          alert("Please enter a valid email address");
          return;
        }
        if (editedUsername.trim().length === 0) {
          alert("Please enter a username");
          return;
        } else if (/\s/.test(editedUsername)) {
          alert("Username should not contain spaces");
          return;
        }
        if (!editedDateOfBirth) {
          alert("Please enter your date of birth");
          return;
        }  
        const updatedData = { name: editedName, username: editedUsername, dateOfBirth: editedDateOfBirth, gender: editedGender, weight: editedWeight, height: editedHeight, email: editedEmail};
        try {
          const response = await fetch("http://localhost:8000/updateUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({updatedData,user,adminUsername}),
          });
          if(response.ok) {
            alert("User Successfully Updated !");
            fetchData();
            }
          else if(response.status === 400){
            alert("Username or Email already in use.");
          }
          else if(response.status === 409){
            alert("Username is already been used by an admin. So it is currently restricted.");
          }
          else{
              alert("User not updated.");
            }
        }
        catch (error) {
          console.error(error);
        }
      };

      const cancelEdit = () => {
        setSelectedUserId(null);
        setEditedName('');
        setEditedUsername('');
        setEditedDateOfBirth('');
        setEditedGender('');
        setEditedWeight('');
        setEditedHeight('');
        setEditedEmail('');
      };

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


    async function addUser(event) {
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
        }
        if (gender.trim().length === 0) {
          alert("Please select your gender");
          return;
        }
        if (!dateOfBirth) {
          alert("Please enter your date of birth");
          return;
        }  
    
        const data = { name, email, username, password, gender,dateOfBirth,adminUsername };
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
              alert("User registered successfully");
              setName("");
              setEmail("");
              setUsername("");
              setPassword("");
              setGender("");
              setDateOfBirth("");
              setShowAddRow(false);
              fetchData();
            }
            else if (response.status === 400) {
              const data = await response.json();
              if (data.error === "Email or username already in use"){
                alert("Email or username already in use");
              }
            }
            else if (response.status === 409) {
              alert("Username already in use by an Administrator, it is currently restriced for users.");
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
        }
      }
        catch (error) {
          console.error(error);
        }
      };

  return (
    <div className="user-management">
        <h1>Members Management</h1>
        <table className="table-fill">
        <thead>
          <tr>
            <th className="text-left">Full Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Username</th>
            {showAddRow &&
            <th className="text-left">Password</th>
            }
            <th className="text-left">Age</th>
            <th className="text-left">Gender</th>
            <th className="text-left">Subscription</th>
            <th className="text-left">Weight (in kg) </th>
            <th className="text-left">Height (in cm) </th>
            <th className="text-left">Subscription Expiry Date</th>
            <th className="text-left">User ID</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody className="table-hover">
        {Array.isArray(users) &&  users.map((item) => (
          <tr>
            <td className="text-left">
                <span></span>{" "} {item.username === selectedUserId ? ( <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} /> ) : ( item.name )}
            </td>
            <td className="text-left">
                <span></span>{" "} {item.username === selectedUserId ? ( <input type="text" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} /> ) : ( item.email || "N/A" )}
            </td>
            <td className="text-left">
                <span></span>{" "} {item.username === selectedUserId ? ( <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} /> ) : ( item.username )}
            </td>
            <td className="text-left">
                {item.username === selectedUserId ? ( <div> <span></span>{" "} <input type="date" id="dateOfBirth" name="dateOfBirth" value={editedDateOfBirth} onChange={(e) => setEditedDateOfBirth(e.target.value)} /> </div> ) : ( <p> <span></span> {getAgeFromDateOfBirth(item.dateOfBirth)} </p> )}
            </td>
            <td className="text-left">
                <span>{item.gender} </span>{" "}
            </td>
            <td className="text-left">
                {item.weight != null ? (<span>Yes</span>): (<span>No</span>)}
            </td>
            <td className="text-left">
                {item.username === selectedUserId ? ( item.weight != null ? ( <input type="text" value={editedWeight} onChange={(e) => setEditedWeight(e.target.value)} /> ) : ( "N/A" ) ) : ( item.weight || "N/A" )}
            </td>
            <td className="text-left">
                {item.username === selectedUserId ? ( item.height != null ? ( <input type="text" value={editedHeight} onChange={(e) => setEditedHeight(e.target.value)} /> ) : ( "N/A" ) ) : ( item.height || "N/A" )}
            </td>
            <td className="text-left"> 
                {item.subscriptionValidityDate ? ( new Date(item.subscriptionValidityDate).toLocaleDateString() ) : ( "N/A" )} 
            </td>
            <td className="text-left">
                {item.id ? item.id : "N/A"}
            </td>
            <td>
            {item.username === selectedUserId ? (
                <div className="editmodeButton">
                    <button className="glow-on-hover1" onClick={() => saveChanges(item.username,item.id)}>Save</button>
                    <button className="glow-on-hover1" onClick={cancelEdit}>Cancel</button>
                </div>
                ) : (
                <button className="glow-on-hover1" onClick={() => startEdit(item)}>Edit</button>
                )}
            </td>
                <td>
                    <button className="glow-on-hover1" onClick={() => deleteUsers(item.username)}>Remove Member</button>
                </td>
           </tr>
        ))}
        {showAddRow && (
            <tr>
            <td className="text-left">
              <input type="text" id="name" name="name" placeholder="Enter your Full Name" value={name} onChange={(event) => setName(event.target.value)} />
            </td>
            <td className="text-left">
                <input type="email" id="email" name="email" placeholder="Enter your Email" value={email} onChange={(event) => setEmail(event.target.value)} />  
            </td>
            <td className="text-left">
                <input type="text" id="username" name="username" placeholder="Enter your Username" value={username} onChange={(event) => setUsername(event.target.value)} />
            </td>
            <td className="text-left">
                <input type="password" id="password" name="password" placeholder="Enter your Password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </td>
            <td className="text-left">
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
            </td>
            <td className="text-left">
                <select id="gender" name="gender" value={gender} onChange={(event) => setGender(event.target.value)} > <option value="">Select your gender</option> <option value="male">Male</option> <option value="female">Female</option> </select>
            </td>
            <td className="text-left">
                <span>-</span>
            </td>
            <td className="text-left">
                <span>-</span>
            </td>
            <td className="text-left">
                <span>-</span>
            </td>
            <td className="text-left">
                <span>-</span>
            </td>
            <td className="text-left">
                <span>-</span>
            </td>
            <td className="text-left">
                    <button className="glow-on-hover1" onClick={addUser}>Add Member</button>
            </td>
            <td className="text-left">
                    <button className="glow-on-hover1" onClick={() => cancelclick()}>Cancel</button>
            </td>
      </tr>
          )}
            </tbody>
        </table>
        {!showAddRow && (
        <button className="glow-on-hover" onClick={() => setShowAddRow(true)}>
          +
        </button>
      )}
    </div>
  );
}