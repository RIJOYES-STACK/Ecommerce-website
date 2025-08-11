import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';


export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const BASE_URL = 'http://localhost:3002/api';
  const token=localStorage.getItem('token');
  const config={
    headers:{
      Authorization:`Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/products/${id}`,config);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/cart/add`,
        { productId: id, quantity: 1 }, // Added quantity for safety
       config
      );
      alert('Product successfully added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (!product) {
    return (
      <>
        
        <div className="container mt-5 text-center">
          <h3>Loading product details...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img src={product.image} alt={product.name} className="img-fluid" />
          </div>
          <div className="col-md-6">
            <h1>{product.name}</h1>
            <h4 className="text-muted">${product.price}</h4>
            <p>{product.description}</p>
            <button onClick={addToCart} className="btn btn-primary">Add to Cart</button>
            <Link to="/" className="btn btn-secondary ms-2">Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  );
};
