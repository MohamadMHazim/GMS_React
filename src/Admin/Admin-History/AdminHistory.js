import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function AdminHistory () {

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
    const [aTransactions , setaTransactions ] = useState("");
    const adminUsername = localStorage.getItem('adminUsername');
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
            setaTransactions(result.admin_trans);
        }
      }
        catch (error) {
          console.error(error);
        }
      };

    return (
        <div className="transactions-page">
        <h1>Admins History</h1>
        <table className="my-table">
        <thead>
            <tr>
            <th>Admin Username</th>
            <th>Time</th>
            <th>Work Done</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
        {Array.isArray(aTransactions) && aTransactions.map((aTransactions, index) => (
            <tr>
            <td><strong>{aTransactions.admin_username ? aTransactions.admin_username : 'Removed Admin'}</strong></td>
            <td>{aTransactions.time}</td>
            <td>{aTransactions.transaction_type}</td>
            <td>{new Date(aTransactions.date).toLocaleDateString()}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    )
}