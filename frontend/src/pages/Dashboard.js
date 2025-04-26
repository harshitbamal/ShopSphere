import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if user is not logged in
    useEffect(() => {
        if (!user) {
            console.log("User not found, redirecting to login...");
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/products");
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="dashboard">
            {/* Top Navigation Bar */}
            <div className="top-nav">
                <div className="logo">ShopSphere</div>
                <input
                    type="text"
                    placeholder="Search for products, brands and more"
                    className="search-bar"
                />
                <div className="nav-links">
                    <Link to="/cart" className="nav-link">🛒 Cart</Link>
                    <button onClick={logout} className="nav-link logout-button">Logout</button>
                </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
                <ul className="sidebar-links">
                    <li><Link to="/products" className="sidebar-link">Products</Link></li>
                    <li><Link to="/cart" className="sidebar-link">Cart</Link></li>
                    <li><Link to="/orders" className="sidebar-link">Orders</Link></li>
                    <li><Link to="/profile" className="sidebar-link">Profile</Link></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <h2 className="main-title">Featured Products</h2>

                {/* Loading & Error Handling */}
                {loading ? <p>Loading products...</p> : error ? <p>Error: {error}</p> : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">${product.price}</p>
                                
                                {/* Show Rating and Number of Reviews */}
                                <p className="product-rating">⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)</p>
                                
                                <Link to={`/product/${product._id}`} className="view-details-button">View Details</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
