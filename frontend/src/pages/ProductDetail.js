import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const submitReview = async () => {
        const token = localStorage.getItem("token"); 
    
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  
                },
                body: JSON.stringify({ rating, comment }),
            });
    
            if (response.ok) {
                const updatedProduct = await response.json();
                alert("Review added!");
                setProduct(updatedProduct.product); 
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to add review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };
    
    

    return product ? (
        <div>
            <h2>{product.title}</h2>
            <img src={product.image} alt={product.title} style={{ width: "300px" }} />
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Rating:</strong> {product.rating} ({product.numReviews} reviews)</p>

            <h3>Leave a Review:</h3>
            <select onChange={(e) => setRating(e.target.value)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>{star} Stars</option>
                ))}
            </select>
            <textarea
                placeholder="Write a review..."
                onChange={(e) => setComment(e.target.value)}
                style={{ display: "block", width: "100%", margin: "10px 0", padding: "10px" }}
            ></textarea>
            <button onClick={submitReview} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Submit
            </button>

            <h3>Reviews:</h3>
            {product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                    <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                        <strong>{review.name}</strong> - {review.rating}⭐
                        <p>{review.comment}</p>
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default ProductDetail;
