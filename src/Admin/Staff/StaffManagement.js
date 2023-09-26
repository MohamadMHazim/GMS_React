import React from "react";
import "./StaffManagement.css";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
export default function StaffManagement () {
    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
      };

      useEffect(() => {
        fetchData();
    }, []);

  const [sName , setSname] = useState('');
  const [pNumber , setPnumber] =useState('');
  const [tProgram , setTprogram] = useState('');
  const [wHours , setWhours] = useState('');
  const [pPrice , setPprice] = useState('');
  const [tDays , setTdays] = useState('');
  const [salary,setSalary] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [staff,setStaff]=useState("");
  const [editedTrainerName, setEditedTrainerName] = useState('');
  const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
  const [editedProgram, setEditedProgram] = useState('');
  const [editedWorkingHours, setEditedWorkingHours] = useState('');
  const [editedProgramPrice, setEditedProgramPrice] = useState('');
  const [editedTrainingDays, setEditedTrainingDays] = useState('');
  const [editedSalary, setEditedSalary] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const adminUsername = localStorage.getItem('adminUsername');
  const [showAddRow, setShowAddRow] = useState(false);

  function cancelclick () {
    setSelectedUserId(null);
    setSname("");
    setPnumber("");
    setTprogram("");
    setWhours("");
    setPprice("");
    setTdays("");
    setSalary("");
    setFile(null);
    setFileName("");
    setShowAddRow(false);
  }

  async function releaseStaff(num , name) {
      try{
          const response = await fetch("http://localhost:8000/deleteStaff" , {
            method: "POST",
          headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({num , name , adminUsername}),
      })
      if(response.ok) {
        alert("Staff Successfully Released !");
        fetchData();
        }
        else{
          alert("Staff not Released");
        }
    }
      catch (error){
        console.error(error);
      }
  }

  async function saveTrainerChanges (exPhoneNum) {
    const workingHoursPattern = /^(1[0-2]|0?[1-9])(am|pm) - (1[0-2]|0?[1-9])(am|pm)$/i;
      if (!workingHoursPattern.test(editedWorkingHours)) {
        alert("The working hours format is invalid, It Should be in the form X am/pm-Xam/pm");
        return;
      }
      if (editedTrainerName.trim().length === 0) {
        alert("Please enter a name");
        return;
      } 
      if (editedPhoneNumber.trim().length === 0) {
        alert("Please enter a phone number");
        return;
      }
      else if (editedPhoneNumber.trim().length !== 8) {
        alert("Number should be 8 digits!");
        return;
      }
      if (editedProgram.trim().length === 0) {
        alert("Please enter a Program");
        return;
      }
      if (editedProgramPrice === "0" || editedProgramPrice === "") {
        alert("Please enter a price.");
        return;
      }
      if (editedTrainingDays < 2 || editedTrainingDays > 7) {
        alert("Training Program cannot be less than 2 days or more than 7 !");
        return;
      }
      if (editedSalary == 0) {
        alert("Please enter a salary !");
        return;
      }
    const trimmedPhoneNumber = editedPhoneNumber.trim(); 
    const updatedData = { name: editedTrainerName, number: trimmedPhoneNumber, program: editedProgram, workinghours: editedWorkingHours, programprice: editedProgramPrice, trainingdays: editedTrainingDays, salary: editedSalary};
    try {
      const response = await fetch("http://localhost:8000/updateStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({updatedData,exPhoneNum,adminUsername}),
      });
      if(response.status === 200) {
        alert("Staff Info Successfully Updated !");
        fetchData();
        }
      else if(response.status === 400){
        alert("Phone number already in use.");
      }
      else{
          alert("User not updated.");
        }
    }
    catch (error) {
      console.error(error);
    }
  };

  const startTrainerEdit = (staff) => {
    setSname("");
    setPnumber("");
    setTprogram("");
    setWhours("");
    setPprice("");
    setTdays("");
    setSalary("");
    setFile(null);
    setFileName("");
    setShowAddRow(false);
    setSelectedUserId(staff.phone_number);
    setEditedTrainerName(staff.trainer_name);
    setEditedPhoneNumber(staff.phone_number);
    setEditedProgram(staff.program);
    setEditedProgramPrice(staff.program_price);
    setEditedWorkingHours(staff.working_hours);
    setEditedTrainingDays(staff.training_days);
    setEditedSalary(staff.salary);
  };

  const cancelEdit = () => {
    setSelectedUserId(null);
    setEditedTrainerName('');
    setEditedPhoneNumber('');
    setEditedProgram('');
    setEditedWorkingHours('');
    setEditedTrainingDays('');
    setEditedSalary('');
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
        setStaff(result.staff);
    }
  }
    catch (error) {
      console.error(error);
    }
  };

  async function addStaff (event) {
    event.preventDefault();
    if (sName.trim().length === 0) {
      alert("Please enter a name");
      return;
    } 
    if (pNumber.trim().length === 0) {
      alert("Please enter a phone number");
      return;
    } else if (pNumber.trim().length !== 8) {
      alert("Number should be 8 digits!");
      return;
    }
    if (tProgram.trim().length === 0) {
      alert("Please enter a Program");
      return;
    }
    const workingHoursPattern = /^(1[0-2]|0?[1-9])(am|pm) - (1[0-2]|0?[1-9])(am|pm)$/i;
    if (!workingHoursPattern.test(wHours)) {
      alert("The working hours format is invalid, It Should be in the form X am/pm-Xam/pm");
      return;
    }
    if (pPrice === "0" || pPrice.trim().length === 0) {
      alert("Please enter a price.");
      return;
    }
    if (tDays < 2 || tDays > 7) {
      alert("Training Program cannot be less than 2 days and more than 7 days !");
      return;
    }
    if (salary == 0) {
      alert("Please enter a salary !");
      return;
    }
    if (!file) {
      alert("Please select a photo.");
      return;
    }
  try {
  const staffData = { name: sName, phoneNumber: pNumber, program: tProgram, workingHours: wHours, programPrice: pPrice, trainingDays: tDays, salary: salary };
  const myForm = new FormData();
  myForm.append('staffData', JSON.stringify(staffData));
  myForm.append("file", file);
  myForm.append("fileName", fileName);
  myForm.append("adminUsername",adminUsername)
  const myResponse = await axios.post('http://localhost:8000/addStaff', myForm, { headers: {'Content-Type': 'multipart/form-data'}})
  if (myResponse.status === 200) {
    alert("Staff Added!");
    setSname("");
    setPnumber("");
    setTprogram("");
    setWhours("");
    setPprice("");
    setTdays("");
    setSalary("");
    setFile(null);
    setFileName("");
    setShowAddRow(false);
    fetchData();
  } 
} catch (error) {
  if (error.response && error.response.status === 409) {
    alert("Phone Number is duplicate");
  } else {
    console.log(error);
  }
}
}
    return (
        <div className="user-management">
            <h1>Staff Management</h1>
                <table className="table-fill">
                    <thead>
                    <tr>
                        <th className="text-left">Full Name</th>
                        <th className="text-left">Phone Number</th>
                        <th className="text-left">Program</th>
                        <th className="text-left">Working Hours</th>
                        <th className="text-left">Program Price</th>
                        <th className="text-left">Training Days/week</th>
                        <th className="text-left">Salary</th>
                        <th className="text-left">Photo</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                    </thead>
                    <tbody className="table-hover">
                    {Array.isArray(staff) && staff.map((item) => (
                        <tr>
                            <td className="text-left">
                                {item.phone_number === selectedUserId ? ( <input type="text" id="name" name="trainer_name" value={editedTrainerName} placeholder="Enter Staff Name" onChange={(e) => setEditedTrainerName(e.target.value)} /> ): ( (item.trainer_name))}
                            </td>
                          <td className="text-left">
                            {item.phone_number === selectedUserId ? ( <input type="text" id="phone" name="phone_number" placeholder="Enter Phone Number (+961 code only)" value={editedPhoneNumber} onChange={(e) => setEditedPhoneNumber(e.target.value)} /> ) : ( (item.phone_number) )}
                          </td>
                          <td className="text-left">
                            {item.phone_number === selectedUserId ? ( <input type="text" id="program" name="program" placeholder="Enter Program" value={editedProgram} onChange={(e) => setEditedProgram(e.target.value)} /> ) : ( item.program )}
                          </td>
                          <td className="text-left">
                            {item.phone_number === selectedUserId ? ( <input type="text" id="hours" name="working_hours" placeholder="Enter Working Hours (8am - 12pm)" value={editedWorkingHours} onChange={(e) => setEditedWorkingHours(e.target.value)} /> ) : ( item.working_hours )}
                          </td>
                          <td className="text-left">
                            {item.phone_number === selectedUserId ? (
                              <input type="text" id="price" name="program_price" value={editedProgramPrice} placeholder="Enter Progran Price (in $)" onChange={(e) => setEditedProgramPrice(e.target.value)} /> ) : ( `${item.program_price} $/month` )}
                          </td>
                          <td className="text-left">
                            {item.phone_number === selectedUserId ? (
                              <input type="text" id="days" name="training_days" value={editedTrainingDays} placeholder="Enter Training Days (between 2 and 7) " onChange={(e) => setEditedTrainingDays(e.target.value)} /> ) : ( item.training_days )}
                          </td>
                          <td className="text-left">
                            {item.phone_number === selectedUserId ? ( <input type="text" id="salary" placeholder="Enter His Salary (in $)" name="salary" value={editedSalary} onChange={(e) => setEditedSalary(e.target.value)} /> ) : ( `${item.salary} $` )}
                          </td>
                          <td className="text-left">
                            <img src={`data:image/jpeg;base64,${arrayBufferToBase64(item.photo.data)}`} alt='trainer_image' className="trainerimage"/>
                          </td>
                          <td>
            {item.phone_number === selectedUserId ? (
                <div className="editmodeButton">
                    <button className="glow-on-hover1" onClick={() => saveTrainerChanges(item.phone_number)}>Save</button>
                    <button className="glow-on-hover1" onClick={cancelEdit}>Cancel</button>
                </div>
                ) : (
                <button className="glow-on-hover1" onClick={() => startTrainerEdit(item)}>Edit</button>
                )}
            </td>
                <td>
                    <button className="glow-on-hover1" onClick={() => releaseStaff(item.phone_number)}>Remove Staff</button>
                </td>
           </tr>
        ))}
        {showAddRow &&
          <tr>
          <td className="text-left">
            <input type="text" id="sname" name="sname" placeholder="Enter Staff Name" value={sName} onChange={(event) => setSname(event.target.value)} required/>
          </td>
          <td className="text-left">
            <input type="text" id="number" name="phonenb" placeholder="Enter Staff phone number (+961 code only !)" value={pNumber} onChange={(event) => setPnumber(event.target.value)} required />
          </td>
          <td className="text-left">
            <input type="text" id="prog" name="program" placeholder="Enter the program" value={tProgram} onChange={(event) => setTprogram(event.target.value)} required />
          </td>
          <td className="text-left">
            <input type="text" id="wHours" name="workingHours" placeholder="Enter working hours (8am - 12pm)" value={wHours} onChange={(event) => setWhours(event.target.value)} required />
          </td>
          <td className="text-left">
            <input type="text" id="price" name="programPrice" placeholder="Enter Program Price (in $)" value={pPrice} onChange={(event) => setPprice(event.target.value)} required />
          </td>
          <td className="text-left">
            <input type="text" id="tDays" name="trainingDays" placeholder="Enter Training Days (Between 2 and 7)" value={tDays} onChange={(event) => setTdays(event.target.value)} required/>
          </td>
          <td className="text-left">
            <input type="text" id="salary" name="salary" placeholder="Enter His Salary (in $)" value={salary} onChange={(event) => setSalary(event.target.value)} required/>
          </td>
          <td className="text-left">
            <input type="file" id="uploadPhoto" name="photo" accept="image/*" onChange={saveFile} required/>
          </td>
          <td className="text-left">
            <button className="glow-on-hover1" onClick={addStaff}>Add Staff</button>
            </td>
            <td className="text-left">
            <button className="glow-on-hover1" onClick={() => cancelclick()}>Cancel</button>
            </td>
        </tr>
}
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