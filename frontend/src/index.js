import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CartProvider from "./context/CartContext"; // Import CartProvider
import App from "./App";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <CartProvider>
            <Router>
                <App />
            </Router>
        </CartProvider>
    </AuthProvider>
);

