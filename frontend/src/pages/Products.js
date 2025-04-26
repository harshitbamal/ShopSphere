import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, [search, category, priceMin, priceMax]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            console.log("Fetched products:", data); // Debugging log
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <div>
            <h2>Products</h2>

            {/* Filters */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search products..."
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                />
                <select
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Price"
                    onChange={(e) => setPriceMin(e.target.value)}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    onChange={(e) => setPriceMax(e.target.value)}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                />
            </div>

            {/* Product List */}
            {products.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "10px",
                                borderRadius: "5px",
                                width: "250px",
                                textAlign: "center",
                            }}
                        >
                            {/* Display product image */}
                            <img
                                src={product.image}
                                alt={product.title}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    objectFit: "contain",
                                    borderRadius: "5px",
                                }}
                            />
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <button
                                onClick={() => addToCart(product)}
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 15px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
