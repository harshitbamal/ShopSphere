const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get all products with search and filter
router.get("/", async (req, res) => {
    try {
        const { search, category, priceMin, priceMax } = req.query;
        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        if (category) {
            filter.category = category;
        }

        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin) filter.price.$gte = Number(priceMin);
            if (priceMax) filter.price.$lte = Number(priceMax);
        }

        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/:id/review", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const { rating, comment } = req.body;
        if (!rating || !comment) {
            return res.status(400).json({ error: "Rating and comment are required" });
        }

        const review = {
            name: "Anonymous User", // Placeholder, replace with user authentication if implemented
            rating: Number(rating),
            comment: comment.trim(),
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

        await product.save();
        res.json(product); // Send updated product data back
    } catch (error) {
        console.error("Review Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});




module.exports = router;
