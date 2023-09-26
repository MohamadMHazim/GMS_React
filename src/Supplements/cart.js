import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Supplements from './supplements';
import Checkout from './Checkout';

function Cart() {
  const [cart, setCart] = React.useState([]);

  function addToCart(product) {
    setCart([...cart, product]);
  }

  function removeFromCart(index) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  }

  console.log("hi");

  return (
    <div>
      <Routes>
        <Route exact path="/user/supplements">
          <Supplements cart={cart} addToCart={addToCart} />
        </Route>
        <Route path="/user/supplements/checkout">
          <Checkout cart={cart} removeFromCart={removeFromCart} />
        </Route>
      </Routes>
    </div>
  );
}

export default Cart;