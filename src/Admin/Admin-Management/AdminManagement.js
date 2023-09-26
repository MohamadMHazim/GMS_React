import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
export default function AdminManagement () {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem('adminUsername');
  useEffect(() => {
    if(adminUsername != "admin") {
      alert("Access is denied !");
      window.location.reload();
      return; 
    }
}, []);  
  
  useEffect(() => {
        fetchData();
    }, []);

    function cancelclick () {
      setSelectedUserId(null);
      setAdminName("");
      setAdminUser("");
      setAdminAge("");
      setAdminPosition("");
      setAdminGender("");
      setAdminPassword("");
      setFile(null);
      setFileName("");
      setShowAddRow(false);
    }

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
      };

      function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }
  const [adminName, setAdminName] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminAge, setAdminAge] = useState("");
  const [adminPosition, setAdminPosition] = useState("");
  const [adminGender, setAdminGender] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminArray , setAdminArray] = useState("");
  const [editedAdminName , setEditedAdminName] = useState('');
  const [editedAdminUsername , setEditedAdminUsername]= useState ('');
  const [editedAdminAge,setEditedAdminAge] = useState('');
  const [editedAdminRole,setEditedAdminRole] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [showAddRow, setShowAddRow] = useState(false);
  async function addAdmin (event) {
    if (adminName.trim().length === 0) {
      alert("Please enter a name");
      return;
    } 
    if (adminUser.trim().length === 0) {
      alert("Please enter a username");
      return;
    }
    else if (/^\s|\s$/.test(adminUser)) {
      alert("Username should not contain spaces at the beginning or end");
      return;
    } 
    const trimmedUsername = adminUser.trim();
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(adminPassword)) {
      alert(
        "Password should have minimum 8 characters, one special character, one upper case and one lower case letter"
      );
      return;
    }
    if (adminGender.trim().length === 0) {
      alert("Please select your gender");
      return;
    }
    if(getAgeFromDateOfBirth(adminAge) < 18) {
      alert("Admin cannot be less than 18");
    }
    console.log(adminAge);
    event.preventDefault();
    const adminData = {adminName: adminName , trimmedUsername: trimmedUsername , adminAge:adminAge , adminPosition: adminPosition, adminGender: adminGender , adminPassword: adminPassword ,adminUsername: adminUsername}
    const myForm = new FormData();
    myForm.append('adminData', JSON.stringify(adminData));
    myForm.append("file", file);
    myForm.append("fileName", fileName);
    myForm.append("adminUsername", adminUsername)
    try {
    const response = await axios.post('http://localhost:8000/addAdmins', myForm, { headers: {'Content-Type': 'multipart/form-data'}})
    if (response.status === 200) {
        alert("Admin Added!");
        fetchData();
        setFile("");
      }
    }
    catch (error) {
        if (error.response && error.response.status === 409) {
          alert("Admin Username is duplicate !");
        }
        else if (error.response && error.response.status === 400) {
            alert("Username used by a normal user & is duplicate !");
          }
        console.error(error);
      }
  }

  async function saveAdminChanges (exUsername) {
    if (exUsername === "admin") {
      alert("Cannot update main admin !");
      return;
    }
    const updatedData = {name: editedAdminName , username : editedAdminUsername , age: editedAdminAge , role : editedAdminRole};
    try {
        const response = await fetch ("http://localhost:8000/updateAdmin" , {
          method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({updatedData,exUsername,adminUsername}),
        })
        if(response.ok) {
          alert("Changes Successfully Changed !");
          fetchData();
        }
        else if (response.status === 409 ) {
          alert("Username is not available !");
        }
        else if(response.status === 412) {
          alert("Username already in use by a normal user.");
        }
        else {
          alert("Changes not applied !");
        }
    }
    catch(error) {
      console.log(error);
    }
  }

  const startAdminEdit = (admin) => {
    setSelectedUserId(admin.username);
    setEditedAdminName(admin.name);
    setEditedAdminUsername(admin.username);
    const admindob = new Date(admin.age);
    const year = admindob.getFullYear();
    const month = String(admindob.getMonth() + 1).padStart(2, '0');
    const day = String(admindob.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setEditedAdminAge(formattedDate);
    setEditedAdminRole(admin.role);
}

const cancelEdit = () => {
    setSelectedUserId('');
    setEditedAdminAge('');
    setEditedAdminName('');
    setEditedAdminRole('');
    setEditedAdminUsername('');
  };

  async function removeAdmin(username) {
    if(username == "admin") {
        alert("Cannot delete main admin.");
        return;
    }
      try {
        const response = await fetch ("http://localhost:8000/removeAdmin" , {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({username,adminUsername}),
        })
        if(response.ok) {
          alert ("Admin Deleted !");
          fetchData();
        }
        else {
          alert ("Admin not deleted !");
        }
      }
      catch(error) {
        console.log(error);
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
        setAdminArray(result.admins);
    }
  }
    catch (error) {
      console.error(error);
    }
  };

  
    return (
        <div className="user-management">
                <h1>Admin Management</h1>
        <table className="table-fill">
        <thead>
          <tr>
            <th className="text-left">Admin Name</th>
            <th className="text-left">Admin Username</th>
            <th className="text-left">Admin Password</th>
            <th className="text-left">Age</th>
            <th className="text-left">Gender</th>
            <th className="text-left">Role</th>
            <th className="text-left">Enrolled Since</th>
            <th className="text-left">Admin Photo</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>

        <tbody className="table-hover">
        {Array.isArray(adminArray) &&  adminArray.map((item) => (
          <tr>
            <td className="text-left">
                {item.username === selectedUserId ? ( <input type="text" id="name" name="trainer_name" value={editedAdminName} onChange={(e) => setEditedAdminName(e.target.value)} /> ): ( (item.name)) }
            </td>
            <td className="text-left">
                {item.username === selectedUserId ? ( <input type="text" id="name" name="trainer_name" value={editedAdminUsername} onChange={(e) => setEditedAdminUsername(e.target.value)} /> ): ( (item.username)) }
            </td>
            <td className="text-left">
            <span className="info-label">{item.password} </span>{" "}
            </td>
            <td className="text-left">
                {item.username === selectedUserId ? ( <input type="date" id="dateOfBirth" name="dateOfBirth" value={editedAdminAge} onChange={(e) => setEditedAdminAge(e.target.value)} /> ): ( getAgeFromDateOfBirth(item.age)) }
            </td>
            <td className="text-left">
            <span className="info-label">{item.gender} </span>{" "}
            </td>
            <td className="text-left">
                {item.username === selectedUserId ? ( <input type="text" id="name" name="trainer_name" value={editedAdminRole} onChange={(e) => setEditedAdminRole(e.target.value)} /> ): ( (item.role)) }
            </td>
            <td className="text-left">
                {new Date(item.EC).toLocaleDateString()}{" "}
            </td>
            <td className="text-left">
                <img src={`data:image/jpeg;base64,${arrayBufferToBase64(item.admin_pic.data)}`} alt='trainer_image' className="trainerimage"/>
            </td>
            <td>
            {item.username === selectedUserId ? (
                <div className="editmodeButton">
                    <button className="glow-on-hover1" onClick={() => saveAdminChanges(item.username)}>Save</button>
                    <button className="glow-on-hover1" onClick={cancelEdit}>Cancel</button>
                </div>
                ) : (
                <button className="glow-on-hover1" onClick={() => startAdminEdit(item)}>Edit</button>
                )}
            </td>
                <td>
                    <button className="glow-on-hover1" onClick={() => removeAdmin(item.username)}>Remove Admin</button>
                </td>
           </tr>
        ))}
        {showAddRow && (
          <tr>
          <td className="text-left">
          <input type="text" id="supplementName" name="supplementName" placeholder="Enter Admin Name" value={adminName} onChange={(event) => setAdminName(event.target.value)} required/>
      </td>
      <td className="text-left">
          <input type="text" id="supplementName" name="supplementName" placeholder="Enter Admin Username" value={adminUser} onChange={(event) => setAdminUser(event.target.value)} required/>
      </td>
      <td className="text-left">
          <input type="password" id="password" name="password" placeholder="Enter your Password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} required/>
      </td>
      <td className="text-left">
          <input type="date" id="dateOfBirth" name="dateOfBirth" value={adminAge} onChange={(event) => setAdminAge(event.target.value)} required/>
      </td>
      <td className="text-left">
          <select id="gender" name="gender" value={adminGender} onChange={(event) => setAdminGender(event.target.value)} required> <option value="">Select your gender</option> <option value="male">Male</option> <option value="female">Female</option> </select>
      </td>
      <td className="text-left">
          <input type="text" id="servings" name="servings" placeholder="Enter Role" value={adminPosition} onChange={(event) => setAdminPosition(event.target.value)} required/>
      </td>
      <td className="text-left">
          TBD
      </td>
      <td className="text-left">
          <input type="file" id="suppPhoto" name="suppPhoto" accept="image/*" onChange={saveFile} required/>
      </td>
      <td className="text-left">
            <button className="glow-on-hover1" onClick={addAdmin}>Add Admin</button>
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
    )
}