const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Product = require("./models/Product");
const productRoutes = require("./routes/productRoutes");

dotenv.config();


const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info (e.g., user ID) to the request object
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ error: "Token is not valid" });
    }
};

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Registration
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/products/:id/reviews', verifyToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const review = { 
            user: req.user.userId,  // Correcting user ID retrieval
            name: req.user.name,  // Adding user name
            rating, 
            comment, 
            createdAt: new Date() 
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        // Update average rating
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added successfully!", product });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Server error" });
    }
});



// Fetch User Profile
app.get("/api/users/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Fetch Products
app.get("/api/products", async (req, res) => {
    try {
        console.log("Fetching products from the database...");
        const products = await Product.find();
        console.log("Products fetched:", products);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Server error while fetching products" });
    }
});

app.use("/api/products", productRoutes);
// import path from 'path';
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
