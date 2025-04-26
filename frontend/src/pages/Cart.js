import React, { useState, useEffect } from "react";

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]); // Save cart when it updates

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                cart.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ddd",
                            padding: "10px",
                            borderRadius: "5px",
                            marginBottom: "10px",
                        }}
                    >
                        {/* Display product image */}
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "fill",
                                borderRadius: "5px",
                                marginRight: "20px",
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3>{product.name}</h3>
                            <p>Price: ${product.price}</p>
                        </div>
                        <button
                            onClick={() => handleRemoveFromCart(product.id)}
                            style={{
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                padding: "10px 15px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;
