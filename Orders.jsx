import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Components/Navbar";

const Orders = () => {
    const [orders, setorders] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [shippingaddress, setshippingaddress] = useState({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: ""
    });

    const BASE_API = "http://localhost:3002/api";
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchorders = async () => {
            try {
                const response = await axios.get(`${BASE_API}/orders/order`, config);
                setorders(response.data);
            } catch (err) {
                console.error("error fetching orders", err);
            }
        };
        fetchorders();
    }, []);

    const handlecancelorder = async (orderid) => {
        try {
            await axios.delete(`${BASE_API}/orders/${orderid}`, config);
            alert('order cancelled successfully');
            setorders(orders.filter(order => order._id !== orderid));
        } catch (err) {
            console.error("error cancelling order", err);
        }
    };

    const handleEditClick = (order) => {
        setEditingOrderId(order._id);
        setshippingaddress(order.shippingAddress);
    };

    const handleshippingaddresschange = (e) => {
        setshippingaddress({ ...shippingaddress, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async (orderid) => {
        try {
            await axios.put(`${BASE_API}/orders/${orderid}/shipping`, { shippingAddress: shippingaddress }, config);
            alert('Shipping address updated successfully');
            setorders(orders.map(order => order._id === orderid ? { ...order, shippingAddress: shippingaddress } : order));
            setEditingOrderId(null);
        } catch (err) {
            console.error("Error updating shipping address", err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h1 className="text-center mb-4">Order History</h1>
                {Array.isArray(orders) && orders.length === 0 ? (
                    <div className="alert alert-info text-center">No orders found</div>
                ) : (
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Products</th>
                                <th>Total Amount</th>
                                <th>Shipping Address</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(orders) && orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>
                                        <ul>
                                            {order.products.map((item, index) => (
                                                <li key={index}>{item.productId?.name || "Unknown Product"} (x{item.quantity})</li>

                                            ))}
                                        </ul>
                                    </td>
                                    <td>${order.totalAmount}</td>
                                    <td>
                                        {editingOrderId === order._id ? (
                                            <div>
                                               <input type="text" name="fullName" value={shippingaddress.fullName} onChange={handleshippingaddresschange} placeholder="Full Name" className="form-control mb-2" />
                                                <input type="text" name="address" value={shippingaddress.address} onChange={handleshippingaddresschange} placeholder="Address" className="form-control mb-2" />
                                                <input type="text" name="city" value={shippingaddress.city} onChange={handleshippingaddresschange} placeholder="City" className="form-control mb-2" />
                                                <input type="text" name="postalCode" value={shippingaddress.postalCode} onChange={handleshippingaddresschange} placeholder="Postal Code" className="form-control mb-2" />
                                                <input type="text" name="country" value={shippingaddress.country} onChange={handleshippingaddresschange} placeholder="Country" className="form-control mb-2" />
                                                <button className="btn btn-primary btn-sm" onClick={() => handleSaveAddress(order._id)}>Save</button>
                                            </div>
                                        ) : (
                                            <>
                                                <strong>{order.shippingAddress?.fullName}</strong><br />
                                                {order.shippingAddress?.address}<br />
                                                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                                                {order.shippingAddress?.country}
                                                <button className="btn btn-warning btn-sm mt-2" onClick={() => handleEditClick(order)}>Edit</button>
                                            </>
                                        )}
                                    </td>
                                    <td>{order.status}</td>
                                    <td>
                                        {order.status === "pending" && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handlecancelorder(order._id)}
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default Orders;
