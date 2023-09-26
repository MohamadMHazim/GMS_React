import React from "react";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";

export default function SupplmentsManagement () {
    useEffect(() => {
        fetchData();
    }, []);
  const [supplementName, setSupplementName] = useState('');
  const [brand, setBrand] = useState('');
  const [supplementType, setSupplementType] = useState('');
  const [supp_price, setSuppPrice] = useState("");
  const [supp_servings, setSuppServings] = useState("");
  const [flavor, setFlavor] = useState('');
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const adminUsername = localStorage.getItem('adminUsername');
  const [supplements , setSupplements] = useState('');
  const [editedSuppName , setEditedSuppName] = useState('');
  const [editedBrand , setEditedBrand] = useState('');
  const [editedSuppType , setEditedSuppType] = useState('');
  const [editedSuppPrice , setEditedSuppPrice] = useState('');
  const [editedServings , setEditedServings] = useState('');
  const [editedFlavor , setEditedFlavor] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAddRow, setShowAddRow] = useState(false);

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function cancelclick () {
    setSelectedUserId(null);
    setSupplementName('');
    setBrand('');
    setSupplementType('');
    setSuppPrice('');
    setSuppServings('');
    setFlavor('');
    setFileName('');
    setFile(null);
    setShowAddRow(false);
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
        setSupplements(result.supplements);
    }
  }
    catch (error) {
      console.error(error);
    }
  };

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const cancelEdit = () => {
    setSelectedUserId('');
    setEditedSuppName('');
    setEditedBrand('');
    setEditedServings('');
    setEditedSuppType('');
    setEditedSuppPrice('');
    setEditedFlavor('');
  };

  async function removeSupplement(name) {
    try{
      const response = await fetch("http://localhost:8000/deleteSupplement" , {
        method: "POST",
      headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name,adminUsername}),
  })
  if(response.ok) {
    alert("Supplement Removed Successfully !");
    fetchData();
    }
    else{
      alert("Supplement not removed.");
    }
}
  catch (error){
    console.error(error);
  }
  }

  async function addSupplement (event) {
    if (supplementName.trim().length === 0 ) {
      alert("Please enter a supplement name !");
      return;
    }
    if(brand.trim().length === 0 ) {
      alert("Please choose a brand !");
      return;
    }
    if (supplementType.trim().length === 0) {
      alert("Please choose a supplement type !");
      return;
    }
    if (supp_price == 0 ) {
      alert("Please set a valid price !");
      return;
    }
    if (supp_servings == 0 ) {
      alert("Please set a valid number of servings !");
      return;
    }
    if (flavor.trim().length === 0) {
      alert("Please choose a valid flavor !");
      return;
    }
    if (!file) {
      alert("Please select a photo.");
      return;
    }
    event.preventDefault();
    try {
      const suppData = {name: supplementName , brand: brand , type:supplementType , price: supp_price, servings: supp_servings , flavor: flavor}
      const myForm = new FormData();
      myForm.append('suppData', JSON.stringify(suppData));
      myForm.append("file", file);
      myForm.append("fileName", fileName);
      myForm.append("adminUsername", adminUsername)
      const response = await axios.post('http://localhost:8000/addSupplement', myForm, { headers: {'Content-Type': 'multipart/form-data'}})
      if (response.status === 200) {
        alert("Supplement Added!");
        fetchData();
        setFile("");
      } else if (response.status === 409) {
        console.log(response.data);
        alert("Supplement is already in stock !");
      } else {
        console.log(response.status); 
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Supplement is duplicate !");
      }
      console.error(error);
    }
  }

  async function saveSupplementsChanges (SuppName) {
    if (editedSuppName.trim().length === 0 ) {
      alert("Please enter a supplement name !");
      return;
    }
    if(editedBrand.trim().length === 0 ) {
      alert("Please choose a brand !");
      return;
    }
    if (editedSuppType.trim().length === 0) {
      alert("Please choose a supplement type !");
      return;
    }
    if (editedSuppPrice == 0 ) {
      alert("Please set a valid price !");
      return;
    }
    if (editedServings == 0 ) {
      alert("Please set a valid number of servings !");
      return;
    }
    if (editedFlavor.trim().length === 0) {
      alert("Please choose a valid flavor !");
      return;
    }
    const updatedData = {name: editedSuppName , brand: editedBrand , type : editedSuppType , price: editedSuppPrice , servings: editedServings , flavor : editedFlavor};
    try{
    const response = await fetch("http://localhost:8000/updateSupplement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({updatedData,SuppName,adminUsername}),
      });
      if (response.ok) {
        alert("Supplement Updated Successfully !");
        fetchData();
      }
      else if (response.status === 400) {
        alert("Supplement Name Already in use !");
      }
      else{
        alert("Supplement not updated.");
      }
    }
    catch(error){
      console.error(error);
    }
  };

  const startSupplementEdit = (supp) => {
    setSelectedUserId(supp.supp_name);
    setEditedSuppName(supp.supp_name);
    setEditedBrand(supp.brand);
    setEditedServings(supp.servings);
    setEditedSuppType(supp.supp_type);
    setEditedSuppPrice(supp.price);
    setEditedFlavor(supp.flavor);
  };


    return (
        <div className="user-management">
            <h1>Supplements Management</h1>
        <table className="table-fill">
        <thead>
          <tr>
            <th className="text-left">Supplement Name</th>
            <th className="text-left">Brand</th>
            <th className="text-left">Supplement Type</th>
            <th className="text-left">Price</th>
            <th className="text-left">Servings</th>
            <th className="text-left">Flavor</th>
            <th className="text-left">Photo</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody className="table-hover">
        {Array.isArray(supplements) && supplements.map((item) => (
          <tr>
            <td className="text-left">
                {item.supp_name === selectedUserId ? ( <input type="text" id="name" name="trainer_name" value={editedSuppName} onChange={(e) => setEditedSuppName(e.target.value)} /> ): ( (item.supp_name))}
            </td>
            <td className="text-left">
            {item.supp_name === selectedUserId ? (
                <select id="brand" name="brand" value={editedBrand} onChange={(event) => setEditedBrand(event.target.value)}> <option value="">Select Brand</option> <option value="Optimum Nutrition">Optimum Nutrition</option> <option value="MuscleTech">MuscleTech</option> <option value="MyProtein">MyProtein</option> <option value="Kevin Levrone Signature Series">Kevin Levrone Signature Series</option> </select> ) : ( (item.brand) )}
            </td>
            <td className="text-left">
                {item.supp_name === selectedUserId ? ( <select id="supplementType" name="supplementType" value={editedSuppType} onChange={(event) => setEditedSuppType(event.target.value)}> <option value="">Select Supplement Type</option> <option value="Pre-Workout">Pre-Workout</option> <option value="Protein Powder">Protein Powder</option> <option value="Creatine">Creatine</option> </select> ) : ( item.supp_type )}
            </td>
            <td className="text-left">
                {item.supp_name === selectedUserId ? ( <input type="text" id="hours" name="working_hours" value={editedSuppPrice} onChange={(e) => setEditedSuppPrice(e.target.value)} /> ) : (item.price) + " $" }
            </td>
            <td className="text-left">
                {item.supp_name === selectedUserId ? ( <input type="text" id="price" name="program_price" value={editedServings} onChange={(e) => setEditedServings(e.target.value)} /> ) : (item.servings)}
            </td>
            <td className="text-left">
                {item.supp_name === selectedUserId ? ( <input type="text" id="days" name="training_days" value={editedFlavor} onChange={(e) => setEditedFlavor(e.target.value)} /> ) : ( item.flavor )}
            </td>
            <td className="text-left">
                <img src={`data:image/jpeg;base64,${arrayBufferToBase64(item.supp_photo.data)}`} alt='trainer_image' className="trainerimage"/>
            </td>
            <td>
            {item.supp_name === selectedUserId ? (
                <div className="editmodeButton">
                    <button className="glow-on-hover1" onClick={() => saveSupplementsChanges(item.supp_name)}>Save</button>
                    <button className="glow-on-hover1" onClick={cancelEdit}>Cancel</button>
                </div>
                ) : (
                <button className="glow-on-hover1" onClick={() => startSupplementEdit(item)}>Edit</button>
                )}
            </td>
                <td>
                    <button className="glow-on-hover1" onClick={() => removeSupplement(item.supp_name)}>Remove Supplement</button>
                </td>
           </tr>
        ))}
        {showAddRow && (
        <tr>
        <td className="text-left">
            <input type="text" id="supplementName" name="supplementName" placeholder="Enter Supplement Name" value={supplementName} onChange={(event) => setSupplementName(event.target.value)} required />
        </td>
        <td className="text-left">
            <select id="brand" name="brand" value={brand} onChange={(event) => setBrand(event.target.value)} required> <option value="">Select Brand</option> <option value="Optimum Nutrition">Optimum Nutrition</option> <option value="MuscleTech">MuscleTech</option> <option value="MyProtein">MyProtein</option> <option value="Kevin Levrone Signature Series">Kevin Levrone Signature Series</option> </select>
        </td>
        <td className="text-left">
            <select id="supplementType" name="supplementType" value={supplementType} onChange={(event) => setSupplementType(event.target.value)} required> <option value="">Select Supplement Type</option> <option value="Pre-Workout">Pre-Workout</option> <option value="Protein Powder">Protein Powder</option> <option value="Creatine">Creatine</option> </select>
        </td>
        <td className="text-left">
            <input type="number" id="price" name="price" placeholder="Enter Price" value={supp_price} onChange={(event) => setSuppPrice(Number(event.target.value))} required/>
        </td>
        <td className="text-left">
            <input type="number" id="servings" name="servings" placeholder="Enter Servings" value={supp_servings} onChange={(event) => setSuppServings(Number(event.target.value))} required/>
        </td>
        <td className="text-left">
            <input type="text" id="flavor" name="flavor" placeholder="Enter Flavor" value={flavor} onChange={(event) => setFlavor(event.target.value)} required />
        </td>
        <td className="text-left">
            <input type="file" id="suppPhoto" name="suppPhoto" accept="image/*" onChange={saveFile} required/>
        </td>
        <td className="text-left">
        <button className="glow-on-hover1" onClick={addSupplement}>Add Supp</button>
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