import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./checkout.css";
import { useEffect } from 'react';
function Checkout() {
  const [cardHolderName, setcardHolderName] = useState("");
  const [cardNumber, setcardNumber] = useState("");
  const [expiryDate , setexpiryDate] = useState("");
  const [cvv, setcvv] = useState("");
  const [supp, setSupp] = useState([]);
  const [user,setUser] = useState("");
  const location = useLocation();
  const cart = location.state?.cart || [];
  const navigate = useNavigate();
  const totalPrice = cart.reduce((total, product) => {
    return total + product.price;
  }, 0);
  useEffect (() => {
    const username = localStorage.getItem('username');
    setUser(username);
    console.log(user);
    const suppNames = cart.map(item => item.suppName);
    setSupp(suppNames);
  },[])
  const handleFormSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardHolderName, cardNumber, expiryDate, cvv, totalPrice, supp, user }),
      });
  
      if (response.ok) {
        const { success, balance, message } = await response.json();
  
        if (success) {
          alert(`Credit Card Accepted! Your new balance is: ${balance}`);
          localStorage.removeItem('cart');
          navigate('/user/supplements');
        } else if (message === 'Insufficient balance.') {
          alert('Insufficient balance. Please add more funds or try another credit card.');
          window.location.reload();
        } else {
          console.error('Invalid Payment Information');
          alert('Invalid payment information. Please try again.');
          window.location.reload();
        }
      } else {
        console.error('Server Error');
        alert('An error occurred. Please try again later.');
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="checkout">
    <div className='containerxxx'>
  <div className='window'>
    <div className='order-info'>
      <div className='order-info-content'>
        <h2>Order Summary</h2>
        {cart.map((product, index) => (
  <div key={index}>
    <div className='line'></div>
    <table className='order-table'>
      <tbody>
        <tr>
          <td>
            <img src={`data:image/jpeg;base64,${product.image}`} alt={product.supp_name} />
          </td>
          <td>
            <span className='thin'>{product.suppName}</span>
            <br />
            <span>{product.servings} Servings</span>
            <br />
            <span className='thin small'>Flavor: {product.flavor}</span>
          </td>
        </tr>
        <tr>
          <td>
            <div className='price'>{product.price} $</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
))}
</div>
<div className='order-info-contents'>
<div className='line'></div>
        <div className='total'>
        <span style={{ float: 'left' }}>
            <div className='thin dense'>VAT 19%</div>
            <div className='thin dense'>Delivery</div>
            TOTAL
          </span>
          <span style={{ float: 'right', textAlign: 'center' }}>
            <div className='thin dense'>{totalPrice.toFixed(2)} $</div>
            <div className='thin dense'>Free</div>
            {totalPrice.toFixed(2)} $
          </span>
        </div>
</div>
</div>
<div className='credit-info'>
  <div className='credit-info-content'>
    <img src={require("./Mastercard-Bg.png")} height='150' className='credit-card-image' id='credit-card-image' alt='Credit Card' />
    <div className='input-row'>
      <label htmlFor='card-number'>Card Number</label>
      <input type="text" id="cardNumber" name="cardNumber" className='input-field' value={cardNumber} placeholder="123456789" onChange={(event) => setcardNumber(event.target.value)} required />
    </div>
    <div className='input-row'>
      <label htmlFor='card-holder'>Card Holder</label>
      <input type="text" id="cardHolderName" name="cardHolderName" className='input-field' value={cardHolderName} placeholder="John Smith" onChange={(event) => setcardHolderName(event.target.value)} required />
    </div>
    <div className='inline-inputs'>
      <div className='expires-input'>
        <label htmlFor='expires'>Expires</label>
        <input type="text" id="expiryDate" name="expiryDate" value={expiryDate} pattern="(0[1-9]|1[0-2])\/[0-9]{2}" placeholder="MM/YY" onChange={(event) => setexpiryDate(event.target.value)} required  className='input-field' />
      </div>
      <div className='cvv-input'>
        <label htmlFor='cvv'>CVV</label>
        <input type="text" id="cvv" name="cvv" value={cvv} placeholder="123" onChange={(event) => setcvv(event.target.value)} required  className='input-field' />
      </div>
    </div>
    <button className='pay-btn' onClick={handleFormSubmit}>Checkout</button>
  </div>
</div>
      </div>
</div>
    </div>
  );
}

export default Checkout;