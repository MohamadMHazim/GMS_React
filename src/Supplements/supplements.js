import React from "react";
import { useState } from "react";
import { useEffect } from 'react';
import "./supplements.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
function Supplements() {
	const navigate = useNavigate();	
	const [cart, setCart] = React.useState([]);
	const [stat, setStat] = useState(null);
	const [supplements,setSupplements]=useState("");
	useEffect(() => {
		fetchStat();
		fetchSupplements();
	  }, []);

	  function arrayBufferToBase64(buffer) {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
		  binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	  }

	async function fetchSupplements() {
			try {
			  const response = await fetch("http://localhost:8000/fetchSupplements", {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({ }),
			  });
				
			  if (response.ok) {
				const {supp} = await response.json();
				setSupplements(supp);
				console.log(supp);
			  }
		  }
			 catch (error) {
			  console.error(error);
			  console.log('Error fetching stat');
			}
		  }

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
			console.log(stat);
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

	React.useEffect(() => {
		const storedCart = JSON.parse(localStorage.getItem('cart'));
		if (storedCart) {
		  setCart(storedCart);
		}
	  }, []);
	  useEffect(() => {
		const isLoggedIn = localStorage.getItem('isLoggedIn');
		if (!isLoggedIn) {
		  navigate('/login');
		  alert('Please login first.');
		}
	  }, [navigate]);


	  const handeLogOut = () => {
		localStorage.removeItem('isLoggedIn');
		localStorage.removeItem('cart'); // clear cart data from localStorage
		setCart([]); // reset cart state to an empty array
		navigate('/login');
	  };

	  const backk = () => {
		localStorage.removeItem('cart');
		setCart([]);
		navigate('/user');
	  };

	  function handleAddToCart(suppName, image, price,servings,flavor) {
		const updatedProduct = { suppName: suppName, image: image, price: price , servings: servings , flavor:flavor};
		setCart([...cart, updatedProduct]);
		const updatedCart = [...cart, updatedProduct];
		localStorage.setItem('cart', JSON.stringify(updatedCart));
		setCart(updatedCart);
	  }
	
	  function handleRemoveFromCart(index) {
		const updatedCart = [...cart];
		updatedCart.splice(index, 1);
		setCart(updatedCart);
		localStorage.setItem('cart', JSON.stringify(updatedCart));
	  }
	  function proceedCheckout() {
		if (cart.length === 0){
			alert("Cart is empty ! Please select supplements before proceding.");
			navigate("/user/supplements");
		  }
		  else{
			navigate('/user/supplements/checkout', { state: { cart } });
		  }
	  }
	const [showCart, setShowCart] = useState(false);
	function toggleCart() {
		setShowCart(!showCart);
	  }
    return(
        <div className="page">
			<header>
			<h1 id="header1">Gym Supplements</h1>
			</header>
        <div className="nav-buttons">
            <button id="back-btn" onClick={backk}>
              Back
            </button>
          <div className="cart-icon" onClick={toggleCart}>
		  <FontAwesomeIcon icon={faShoppingCart} size={32} color="white" />
          </div>
		  <button id="sign-btn" onClick={handeLogOut}>
				Sign Out
			</button>
        </div>
	<main>
	<section>
  <h2 id="header2">Pre-Workout</h2>
</section>
<div class="pre_workout">
  {Array.isArray(supplements) && supplements.filter((product) => product.supp_type === "Pre-Workout").map((product, index) => (
      <section key={index}>
        <div className="product1">
		<img src={`data:image/jpeg;base64,${arrayBufferToBase64(product.supp_photo.data)}`} alt='product'/>
          <h3>Brand: {product.brand}</h3>
		  <h3>Product: {product.supp_name}</h3>
		  <h3>Servings: {product.servings}</h3>
		  <h3>Flavor: {product.flavor}</h3>
          <p>Price: {product.price} $</p>
          <button className="btn" onClick={() => handleAddToCart(product.supp_name, arrayBufferToBase64(product.supp_photo.data), product.price,product.servings,product.flavor)}> Add to Cart </button>
        </div>
      </section>
    ))
  }
</div>

<section>
  <h2 id="header3">Protein Powder</h2>
</section>
<div className="protein_powder">
  {Array.isArray(supplements) && supplements.filter((product) => product.supp_type === "Protein Powder").map((product, index) => (
      <section key={index}>
        <div className="product2">
		<img src={`data:image/jpeg;base64,${arrayBufferToBase64(product.supp_photo.data)}`} alt='product'/>
		  <h3>Brand: {product.brand}</h3>
		  <h3>Product: {product.supp_name}</h3>
		  <h3>Servings: {product.servings}</h3>
		  <h3>Flavor: {product.flavor}</h3>
          <p>Price: ${product.price}</p>
          <button className="btn" onClick={() => handleAddToCart(product.supp_name, arrayBufferToBase64(product.supp_photo.data), product.price,product.servings,product.flavor)}> Add to Cart </button>
        </div>
      </section>
    ))
  }
</div>

<section>
  <h2 id="header4">Creatine</h2>
</section>
<div className="creatine">
  {Array.isArray(supplements) && supplements.filter((product) => product.supp_type === "Creatine").map((product, index) => (
      <section key={index}>
        <div className="product3">
		<img src={`data:image/jpeg;base64,${arrayBufferToBase64(product.supp_photo.data)}`} alt='product'/>
		  <h3>Product Brand: {product.brand}</h3>
		  <h3>Product: {product.supp_name}</h3>
		  <h3>Servings: {product.servings}</h3>
		  <h3>Flavor: {product.flavor}</h3>
          <p>Price: {product.price} $</p>
		  <button className="btn" onClick={() => handleAddToCart(product.supp_name, arrayBufferToBase64(product.supp_photo.data), product.price,product.servings,product.flavor)}> Add to Cart </button>
        </div>
      </section>
    ))
  }
</div>
				{showCart && (
          		<div className="cart-tab">
            		<div className="cart-header">
					<h2>Shopping Cart</h2>
						<div className="cart-close" onClick={toggleCart}>
							X
						</div>
            		</div>
            		<ul>
              		{cart.map((item, index) => (
						<li key={index}>
						<span>{item.suppName}</span>
						<span>${item.price.toFixed(2)}</span>
						<button id="shopBt" onClick={() => handleRemoveFromCart(index)}>Remove</button>
						<img src={`data:image/jpeg;base64,${item.image}`} alt={item.supp_name} />
						</li>
              			))}
            		</ul>
            		<p>Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
					<button id="shopBtc" onClick={proceedCheckout}>Proceed to Checkout </button>
          		</div>
        		)}
	</main>
	
            </div>
    );
}

export default Supplements