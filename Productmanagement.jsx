import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';

const Productmanagement = () => {
    const [products, setproducts] = useState([]);
    const [newproduct, setnewproduct] = useState({ name: "", description: "", price: "", category: "", stock: "", image: null });
    const [editid, seteditid] = useState(null);
    const BASE_URL = "http://localhost:3002/api";

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    };

    useEffect(() => {
        const fetchproducts = async () => {
            if (!token) {
                alert(`Access denied. Please log in`);
                return;
            }
            try {
                const response = await axios.get(`${BASE_URL}/admin/product`, config);
                setproducts(response.data);
            } catch (err) {
                console.error("Error fetching products", err);
            }
        }
        fetchproducts();
    }, [token]);

    const handleinputchange = (e) => {
        const { name, value } = e.target;
        setnewproduct({ ...newproduct, [name]: value });
    };

    const handleimagechange = (e) => {
        setnewproduct({ ...newproduct, image: e.target.files[0] });
    };

    const handleaddproduct = async () => {
        if (!token) {
            alert("Access denied. Please log in.");
            return;
        }
        const formdata = new FormData();
        for (let key in newproduct) {
            if (newproduct[key] || key !== 'image') {
                formdata.append(key, newproduct[key]);
            }
        }
        try {
            if (editid) {
                await axios.put(`${BASE_URL}/admin/product/${editid}`, formdata, config);
            } else {
                await axios.post(`${BASE_URL}/admin/`, formdata, config);
            }
            const response = await axios.get(`${BASE_URL}/admin/product`, config);
            setproducts(response.data);
            setnewproduct({ name: "", description: "", price: "", category: "", stock: "", image: null });
            seteditid(null);
        } catch (error) {
            console.error("Error adding/updating product:", error);
        }
    };

    const handleedit = (product) => {
        seteditid(product._id);
        setnewproduct({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image
        });
    };

    const handledelete = async (id) => {
        if (!token) {
            alert("Access denied. Please log in.");
            return;
        }
        try {
            await axios.delete(`${BASE_URL}/admin/product/${id}`, config);
            const response = await axios.get(`${BASE_URL}/admin/product`, config);
            setproducts(response.data);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h1 className="text-center mb-4">Product Management</h1>
                <form onSubmit={(e) => { e.preventDefault(); handleaddproduct(); }} encType="multipart/form-data">
                    <input type="text" name="name" placeholder="Name" value={newproduct.name} onChange={handleinputchange} required className="form-control mb-2" />
                    <input type="text" name="description" placeholder="Description" value={newproduct.description} onChange={handleinputchange} required className="form-control mb-2" />
                    <input type="number" name="price" placeholder="Price" value={newproduct.price} onChange={handleinputchange} required className="form-control mb-2" />
                    <input type="text" name="category" placeholder="Category" value={newproduct.category} onChange={handleinputchange} required className="form-control mb-2" />
                    <input type="number" name="stock" placeholder="Stock" value={newproduct.stock} onChange={handleinputchange} required className="form-control mb-2" />
                    <input type="file" name="image" onChange={handleimagechange} required className="form-control mb-2" />
                    <button type="submit" className="btn btn-primary">{editid ? "Update" : "Add"} Product</button>
                </form>
                <hr />
                <table className="table table-bordered table-striped mt-4">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>
                                <td><img src={product.image} alt={product.name} style={{ width: '100px' }} /></td>
                                <td>
                                    <button onClick={() => handleedit(product)} className="btn btn-warning btn-sm mr-2">Edit</button>
                                    <button onClick={() => handledelete(product._id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Productmanagement;
