import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "../Components/Navbar";

const Cartsdetails = () => {
    const [carts, setcarts] = useState([]);
    const BASE_URL = "http://localhost:3002/api";
    const token=localStorage.getItem('token');
    const config={
        headers:{
            Authorization:`Bearer ${token}`,
        }
    };

    useEffect(() => {
        const fetchcarts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/cart`,config);
                setcarts(response.data.products || []);  // Ensures it's always an array
            } catch (err) {
                console.error("Error fetching carts", err);
            }
        }
        
        fetchcarts();
    }, [])

    const handleremovefromcart = async (productId) => {
        try {
            await axios.delete(`${BASE_URL}/cart/remove/${productId}`,config);
            setcarts(carts.filter(item => item.productId._id !== productId));
        } catch (error) {
            console.error("Error removing item from cart", error);
        }
    };

    const handleplaceorder = async () => {
        const products = carts.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
        }));
        const totalAmount = calculateTotal();
        const shippingAddress = {address:"123 Main St, City, Country"}; // Replace with real data or collect from user input
    
        try {
            await axios.post(
                `${BASE_URL}/orders/place`,
                { products, totalAmount, shippingAddress },
                config
            );
            alert('Order placed successfully');
            setcarts([]);
        } catch (error) {
            console.error("Error placing order", error);
        }
    };
    
    const calculateTotal = () => {
        if (!Array.isArray(carts)) return 0;
        return carts.reduce((total, item) => total + item.productId.price * item.quantity, 0);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h1 className="text-center mb-4">Your Cart</h1>
                {Array.isArray(carts) && carts.length === 0 ? (
                    <div className="alert alert-info text-center">Your cart is empty</div>
                ) : (
                    <>
                        <table className="table table-bordered table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(carts) && carts.map((item => (
                                    <tr key={item.productId._id}>
                                        <td>{item.productId.name}</td>
                                        <td>${item.productId.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.productId.price * item.quantity}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleremovefromcart(item.productId._id)}>Remove</button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                        <div className="text-right">
                            <h4 className="mb-3">Total: ${calculateTotal()}</h4>
                            <button className="btn btn-success" onClick={handleplaceorder}>Order Now</button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Cartsdetails;
