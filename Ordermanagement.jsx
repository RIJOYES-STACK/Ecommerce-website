import React,{useEffect, useState} from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Ordermanagement=()=>{
    const[order,setorder]=useState([])
    const BASE_API="http://localhost:3002/api";
    const token=localStorage.getItem('token');
    const config={
      headers:{
        Authorization:`Bearer ${token}`,
      },
    };

    useEffect(()=>{
        const fetchorders=async()=>{
            try{
            const response=await axios.get(`${BASE_API}/admin/order`,config);
            console.log(response.data);  // Check API response
            setorder(Array.isArray(response.data) ? response.data : []);

        }catch(err){
            console.error("order fetching error",err);
        }
    }
    fetchorders();
},[]);

const handlestatuschange=async(id,newstatus)=>{
    try{
        await axios.put(`${BASE_API}/admin/order/${id}/status`,{status:newstatus},config);
        setorder(order.map(orders=>orders._id===id ?{...orders,status:newstatus}:orders));
    }catch(err){
        console.error("error updating status",err);
    }
};

return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Order Management</h1>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>User</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Shipping Address</th>
                <th>Actions</th>                                            
              </tr>
            </thead>
            <tbody>
              {Array.isArray(order) ? (
                order.map(orders => (
                  <tr key={orders._id}>
                    <td>{orders.userId?.name || 'N/A'}</td>
                    <td>
                      {orders.products.map((product, index) => (
                        <div key={index}>{product.productId?.name || "unknown product"} (x{product.quantity})</div>
                      ))}
                    </td>
                    <td>{orders.totalAmount}</td>
                    <td>{orders.status}</td>
                    <td>
                      {orders.shippingAddress && (
                        <div>
                          {orders.shippingAddress.fullName}<br />
                          {orders.shippingAddress.address}, {orders.shippingAddress.city}<br />
                          {orders.shippingAddress.postalCode}, {orders.shippingAddress.country}
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        value={orders.status}
                        onChange={(e) => handlestatuschange(orders._id, e.target.value)}
                        className="form-control"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Ordermanagement;
