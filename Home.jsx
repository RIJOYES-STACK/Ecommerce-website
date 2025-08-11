
import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';


export const Home = () => {
  const[products,setproducts]=useState([]);
  const BASE_URL="http://localhost:3002/api";
  const token=localStorage.getItem('token');
  const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
};

  useEffect(()=>{
    const fetchproducts=async()=>{
      try{
      const response=await axios.get(`${BASE_URL}/products/products`,{
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });
      setproducts(response.data)
      }catch(err){
        console.error(err);
      }
    };
    fetchproducts();
  },[]);

  const AddtoCart = async (productId) => {
    if (!token) {
      alert('No token found, please log in');
      return;
    }
  
    try {
      await axios.post(
        `${BASE_URL}/cart/add`,
        { productId, quantity: 1 },{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        },
      
      );
  
      alert('Product added successfully to cart');
    } catch (err) {
      console.error('Error adding to the cart', err.response ? err.response.data : err.message);
    }
    
  };
  
  
  return (
    <>
      <Navbar/>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Products</h1>
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">${product.price}</p>
                  <Link to={`/product/${product._id}`} className="btn btn-outline-primary mb-2">View Details</Link>
                  <button onClick={() => AddtoCart(product._id)} className="btn btn-primary mt-auto">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

