import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";

export default function Transactions () {
useEffect(() => {
    fetchStat();
},[])
useEffect(() => {
    fetchData();
}, []);

const [transactions,setTransactions] = useState("");
const [stat, setStat] = useState(1);
const adminUsername = localStorage.getItem('adminUsername');
const navigate = useNavigate();

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
        setTransactions(result.transactions);
    }
    }
    catch (error) {
        console.error(error);
    }
    };

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
    
return (
    <div className="transactions-page">
        <h1>Users Transactions</h1>
        <table className="my-table">
        <thead>
            <tr>
            <th>Username</th>
            <th>Time</th>
            <th>Income</th>
            <th>Transaction Type</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
        {Array.isArray(transactions) && transactions.map((transaction, index) => (
            <tr>
            <td><strong>{transaction.username ? transaction.username : 'Removed User'}</strong></td>
            <td>{transaction.time}</td>
            <td>{transaction.income} $</td>
            <td>{transaction.transaction_type}</td>
            <td>{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
)
}