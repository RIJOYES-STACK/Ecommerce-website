import React,{useState,useEffect} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'

const Cartmanagement=()=>{
    const[carts,setcarts]=useState("");
    const BASE_URL="http://localhost:3002/api";
    const token=localStorage.getItem('token');
    const config={
      headers:{
        Authorization:`Bearer ${token}`,
      },
    };
    useEffect(()=>{
        const fetchcarts=async()=>{
            try {
                const response=await axios.get(`${BASE_URL}/admin/cart`,config);
                setcarts(response.data);
                
            } catch (error) {
                console.error("error fetching carts:",error)
                
            }
        }
        fetchcarts();
    },[]);

    const removecarts=async(cartId)=>{
        try{
            await axios.delete(`${BASE_URL}/admin/cart/${cartId}`,config);
            alert('cart deleted successfully');
            setcarts(carts.filter(cart=>cart._id!==cartId));
        }catch(err){
            console.error("error deleting error",err);
        }
    };

    
    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Cart Management</h1>
        {carts.length === 0 ? (
          <p className="text-center">No carts found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Cart ID</th>
                  <th>User ID</th>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {carts.map(cart => (
                  <tr key={cart._id}>
                    <td>{cart._id}</td>
                    <td>{cart.userId}</td>
                    <td>{cart.productId?._id || 'unknown ID'}</td>
                    <td>{cart.quantity}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => removecarts(cart._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  
  export default Cartmanagement;