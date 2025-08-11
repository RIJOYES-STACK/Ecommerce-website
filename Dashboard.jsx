import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const AdminDashboard = () => {
  return (
    <>
      
      <div className="container mt-5">
        <h1 className="text-center mb-4">Admin Dashboard</h1>
        <div className="list-group">
          <Link to="/admin/products" className="list-group-item list-group-item-action">
            Manage Products
          </Link>
          <Link to="/admin/carts" className="list-group-item list-group-item-action">
            Manage Carts
          </Link>
          <Link to="/admin/orders" className="list-group-item list-group-item-action">
            Manage Orders
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
